import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { createEditor, Text, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import type { Descendant, NodeEntry } from "slate";
import type { SearchRecipeIngredientDTO } from "../types/search-recipe-ingredient-dto";
import { searchRecipeIngredientLine } from "../../../api/recipe-api";
import lodash from "lodash";
import SearchRecipeIngredient from "./SearchRecipeIngredient";
import LineColorStatus from "./LineColorStatus";
import type {
    RecipeIngredientLineRequestDTO,
    RecipeIngredientRequestDTO,
} from "../types/requests/create-recipe-request-dto";
import type { SearchRecipeIngredientRequestDTO } from "../types/requests/search-recipe-ingredient-line-request-dto";
export type IngredientIndex = {
    clickedWord: string | null;
    start: number;
    end: number;
    line: number;
    selectedVarietyName: string | undefined;
    specificOptionDescription: string | undefined;
    searchRecipeIngredientDTO: SearchRecipeIngredientDTO | undefined | null;
};
function RecipeIngredientLineInputArea({
    initialRecipeIngredientLines,
    initialIngredientIndices,
    onChangeCompleteNutrientInfo,
    onChange,
}: {
    onChange: (recipeIngredientLineRequests: RecipeIngredientLineRequestDTO[]) => void;
    initialRecipeIngredientLines?: string[];
    initialIngredientIndices?: {
        start: number;
        end: number;
        line: number;
        selectedVarietyName: string | undefined;
        specificOptionDescription: string | undefined;
    }[];
    onChangeCompleteNutrientInfo: (complete: boolean) => void;
}) {
    // Create the editor instance
    const editor = useMemo(() => withReact(createEditor()), []);

    const [ingredientIndices, setIngredientIndices] = useState<IngredientIndex[]>(
        !initialIngredientIndices
            ? []
            : initialIngredientIndices.map((initIngIdx) => {
                  return {
                      ...initIngIdx,
                      clickedWord: null,
                      searchRecipeIngredientDTO: undefined,
                  };
              })
    );
    const [recipeIngredientLines, setRecipeIngredientLines] = useState<string[]>(
        initialRecipeIngredientLines ?? []
    );
    const [recipeIngredientLineQueryStatus, setRecipeIngredientLineQueryStatus] = useState<
        string[]
    >([]);
    const [hasCompleteNutrientInfo, setHasCompleteNutrientInfo] = useState<boolean>(false);
    const lastParentUpdate = useRef<RecipeIngredientLineRequestDTO[]>([]);
    const timersRef = useRef<number[]>([]);
    const prevIngredientIndices = useRef<IngredientIndex[]>([]);

    useEffect(() => {
        onChangeCompleteNutrientInfo(hasCompleteNutrientInfo);
    }, [hasCompleteNutrientInfo]);

    useEffect(() => {
        const handleClickAnywhere = () => {
            if (ingredientIndices.some((ingIdx) => ingIdx.clickedWord !== null)) {
                return;
            }
            setIngredientIndices((prev) => {
                return prev.map((ingIdx) => ({ ...ingIdx, clickedWord: null }));
            });
        };
        document.addEventListener("click", handleClickAnywhere);
        return () => {
            document.removeEventListener("click", handleClickAnywhere);
        };
    }, []);
    useEffect(() => {
        // check if ingredient indices are complete for nutrient info
        const incompleteInfo =
            ingredientIndices.some((ingIdx) => {
                return (
                    ingIdx.searchRecipeIngredientDTO === undefined ||
                    !ingIdx.searchRecipeIngredientDTO?.nutrientFacts
                );
            }) || ingredientIndices.length === 0;
        if (!incompleteInfo !== hasCompleteNutrientInfo) {
            setHasCompleteNutrientInfo(!incompleteInfo);
        }
        // check which ingredient indices are new and need to be fetched
        const omit = [
            "clickedWord",
            "searchRecipeIngredientDTO",
            "specificOptionDescription",
            "selectedVarietyName",
        ];
        if (
            lodash.isEqual(
                lodash.omit(prevIngredientIndices.current, omit),
                lodash.omit(ingredientIndices, omit)
            )
        ) {
            prevIngredientIndices.current = ingredientIndices;
            return;
        }
        const newIngredientIndices = ingredientIndices.filter((ingIdx) => {
            return (
                ingIdx.searchRecipeIngredientDTO === undefined &&
                !prevIngredientIndices.current.find((prevIngIdx) => {
                    return (
                        ingIdx.start === prevIngIdx.start &&
                        ingIdx.end === prevIngIdx.end &&
                        ingIdx.line === prevIngIdx.line
                    );
                })
            );
        });
        if (newIngredientIndices.length === 0) {
            prevIngredientIndices.current = ingredientIndices;
            return;
        }
        const lineIndicesToSearch = [...new Set(newIngredientIndices.map((ingIdx) => ingIdx.line))];
        setRecipeIngredientLineQueryStatus((prev) => {
            const copy = [...prev];
            lineIndicesToSearch.forEach((lineIdx) => {
                copy[lineIdx] = "loading";
            });
            return copy;
        });
        lineIndicesToSearch.forEach((lineIdx) => {
            const inlineIngredientIndices = ingredientIndices.filter(
                (ingIdx) => ingIdx.line === lineIdx
            );
            timersRef.current[lineIdx] = fetchSearchRecipeIngredientLine(
                recipeIngredientLines[lineIdx],
                inlineIngredientIndices
            );
        });
        prevIngredientIndices.current = ingredientIndices;
    }, [ingredientIndices]);

    useEffect(() => {
        const newRequests: RecipeIngredientLineRequestDTO[] = recipeIngredientLines.map(
            (line, index) => {
                const inLineIngredientIndices = ingredientIndices.filter(
                    (ingIdx) => ingIdx.line === index
                );
                const recipeIngredientInputsAndNull: (RecipeIngredientRequestDTO | null)[] =
                    inLineIngredientIndices.map((ingIdx) => {
                        if (!ingIdx.selectedVarietyName) {
                            return null;
                        }
                        return {
                            ingredientIndex: {
                                start: ingIdx.start,
                                end: ingIdx.end,
                            },
                            selectedVariety: ingIdx.selectedVarietyName,
                            specificOption: ingIdx.specificOptionDescription,
                        };
                    });
                const recipeIngredientInputs = recipeIngredientInputsAndNull.filter(
                    (input) => input !== null
                );
                return {
                    line: line,
                    recipeIngredients: recipeIngredientInputs,
                };
            }
        );
        if (lodash.isEqual(newRequests, lastParentUpdate.current)) {
            return;
        }
        onChange(newRequests);
        lastParentUpdate.current = newRequests;
    }, [ingredientIndices, recipeIngredientLines]);

    function fetchSearchRecipeIngredientLine(
        line: string,
        inLineIngredientIndices: IngredientIndex[]
    ): number {
        const timeoutId = setTimeout(async () => {
            if (line.trim() === "") {
                return;
            }
            const recipeIngredientRequestDTOs: SearchRecipeIngredientRequestDTO[] =
                inLineIngredientIndices.map((ingIdx) => {
                    return {
                        ingredientIndex: {
                            start: ingIdx.start,
                            end: ingIdx.end,
                        },
                        selectedVariety: ingIdx.selectedVarietyName,
                        specificOption: ingIdx.specificOptionDescription,
                    };
                });
            const searchRecipeIngredientLineDTO = await searchRecipeIngredientLine({
                line: line,
                recipeIngredients: recipeIngredientRequestDTOs,
            });
            const newLineIndex = timersRef.current.indexOf(timeoutId);
            if (newLineIndex === -1) return;
            setRecipeIngredientLineQueryStatus((prev) => {
                const copy = [...prev];
                copy[newLineIndex] = "loaded";
                return copy;
            });
            let newIngredientIndices: IngredientIndex[] = inLineIngredientIndices.map((ingIdx) => {
                const matchingDTO = searchRecipeIngredientLineDTO.recipeIngredients.find(
                    (ri) =>
                        ri.ingredientIndex.start === ingIdx.start &&
                        ri.ingredientIndex.end === ingIdx.end &&
                        ingIdx.line === newLineIndex
                );
                if (matchingDTO) {
                    return {
                        ...ingIdx,
                        selectedVarietyName: ingIdx.selectedVarietyName
                            ? ingIdx.selectedVarietyName
                            : matchingDTO.ingredient.selectedVariety.name,
                        searchRecipeIngredientDTO: matchingDTO,
                        specificOptionDescription: matchingDTO.specificOption
                            ? matchingDTO.specificOption
                            : ingIdx.specificOptionDescription,
                    };
                }
                return {
                    ...ingIdx,
                    searchRecipeIngredientDTO: null,
                };
            });
            const nonMatchingDTOs = searchRecipeIngredientLineDTO.recipeIngredients.filter(
                (ri) =>
                    !inLineIngredientIndices.some(
                        (ingIdx) =>
                            ingIdx.start === ri.ingredientIndex.start &&
                            ingIdx.end === ri.ingredientIndex.end &&
                            ingIdx.line === newLineIndex
                    )
            );
            newIngredientIndices = newIngredientIndices.concat(
                nonMatchingDTOs.map((dto) => ({
                    clickedWord: null,
                    start: dto.ingredientIndex.start,
                    end: dto.ingredientIndex.end,
                    line: newLineIndex,
                    selectedVarietyName: dto.ingredient.selectedVariety.name,
                    specificOptionDescription: dto.specificOption ? dto.specificOption : undefined,
                    searchRecipeIngredientDTO: dto,
                }))
            );
            updateWithNewIngredientIndices(newIngredientIndices);
        }, 1000);
        return timeoutId;
    }
    function updateWithNewIngredientIndices(newIngredientIndices: IngredientIndex[]) {
        setIngredientIndices((prev) => {
            return [
                ...prev.filter(
                    (ingIdx) =>
                        !newIngredientIndices.find(
                            (newIngIdx) =>
                                newIngIdx.start === ingIdx.start &&
                                newIngIdx.end === ingIdx.end &&
                                newIngIdx.line === ingIdx.line
                        )
                ),
                ...newIngredientIndices,
            ];
        });
    }
    // initialize empty or filled depending on whether in edit mode
    const initialValue: Descendant[] = !initialRecipeIngredientLines
        ? [
              {
                  children: [{ text: "" }],
              },
          ]
        : initialRecipeIngredientLines.map((line) => {
              return {
                  children: [{ text: line }],
              };
          });

    const handleChange = () => {
        let lines: string[] = [];
        editor.children.forEach((child, index) => {
            if ((child as any).children[0].text) {
                lines[index] = (child as any).children[0].text;
            } else {
                lines[index] = "";
            }
        });
        if (lodash.isEqual(lines, recipeIngredientLines)) {
            return;
        }
        const oldLines = [...recipeIngredientLines];
        let changeStartIndex = -5;
        let changeStartLineIndex = -1;
        let changeEndIndex = -1;
        let changeEndLineIndex = -1;
        let changeEndNewIndex = -1;
        let changeEndNewLineIndex = -1;

        for (let i = 0; i < Math.max(lines.length, oldLines.length); i++) {
            if (lines[i] !== oldLines[i]) {
                changeStartLineIndex = i;
                break;
            }
        }
        const oldChangedStartLine = oldLines[changeStartLineIndex];
        const newChangedStartLine = lines[changeStartLineIndex];
        if (oldChangedStartLine && newChangedStartLine) {
            for (
                let i = 0;
                i <= Math.max(oldChangedStartLine.length, newChangedStartLine.length);
                i++
            ) {
                if (newChangedStartLine.slice(0, i) !== oldChangedStartLine.slice(0, i)) {
                    changeStartIndex = i - 1;
                    break;
                }
            }
        } else {
            changeStartIndex = 0;
        }
        let foundChangeEndIndex = false;
        const oldRemainingLines = oldLines.slice(changeStartLineIndex);
        const newRemainingLines = lines.slice(changeStartLineIndex);
        for (let i = 0; i <= Math.max(lines.length, oldLines.length); i++) {
            const oldLine = oldRemainingLines[oldRemainingLines.length - 1 - i];
            const newLine = newRemainingLines[newRemainingLines.length - 1 - i];
            if (oldLine === undefined || newLine === undefined) {
                changeEndLineIndex = changeStartLineIndex;
                changeEndIndex = changeStartIndex;
                changeEndNewIndex = 0;
                changeEndNewLineIndex = changeEndLineIndex + lines.length - oldLines.length;
                break;
            }
            for (let j = 0; j <= Math.max(newLine.length, oldLine.length); j++) {
                if (
                    newLine.slice(newLine.length - j, newLine.length) !==
                    oldLine.slice(oldLine.length - j, oldLine.length)
                ) {
                    foundChangeEndIndex = true;
                    changeEndIndex = -j + 1 === 0 ? 0 : oldLine.length - j + 1;
                    changeEndNewIndex = -j + 1 === 0 ? 0 : newLine.length - j + 1;
                    changeEndLineIndex =
                        -j + 1 === 0 ? oldLines.length - i : oldLines.length - 1 - i;
                    changeEndNewLineIndex = changeEndLineIndex + lines.length - oldLines.length;
                    break;
                }
            }
            if (foundChangeEndIndex) break;
        }
        // console.log("=============================");
        // console.log("Old lines:", oldLines);
        // console.log("New lines:", lines);
        // console.log("=============================");
        // console.log("Change start:", changeStartIndex);
        // console.log("Change start line:", changeStartLineIndex);
        // console.log("Change end:", changeEndIndex);
        // console.log("Change end line:", changeEndLineIndex);
        // console.log("Change end new:", changeEndNewIndex);
        // console.log("Change end line:", changeEndNewLineIndex);

        let newIngredientIndices: IngredientIndex[] = [];
        setRecipeIngredientLines(lines);
        setIngredientIndices((prev) => {
            newIngredientIndices = prev
                .map((ingIdx) => {
                    let newIngIdx = ingIdx;
                    if (
                        ingIdx.line < changeStartLineIndex ||
                        (ingIdx.line === changeStartLineIndex && ingIdx.end < changeStartIndex)
                    ) {
                        return ingIdx;
                    }
                    if (ingIdx.line >= changeStartLineIndex && ingIdx.line < changeEndLineIndex) {
                        return null;
                    }
                    if (ingIdx.line === changeEndLineIndex && ingIdx.start >= changeEndIndex) {
                        newIngIdx = {
                            ...ingIdx,
                            start: ingIdx.start + changeEndNewIndex - changeEndIndex,
                            end: ingIdx.end + changeEndNewIndex - changeEndIndex,
                            line: ingIdx.line + lines.length - oldLines.length,
                        };
                    }
                    if (ingIdx.line > changeEndLineIndex) {
                        newIngIdx = {
                            ...ingIdx,
                            line: ingIdx.line + lines.length - oldLines.length,
                        };
                    }
                    if (
                        (lines[newIngIdx.line][newIngIdx.start - 1] &&
                            lines[newIngIdx.line][newIngIdx.start - 1] !== " ") ||
                        (lines[newIngIdx.line][newIngIdx.end] &&
                            lines[newIngIdx.line][newIngIdx.end] !== " ")
                    ) {
                        return null;
                    }
                    return newIngIdx;
                })
                .filter((ingIdx) => ingIdx !== null);
            return newIngredientIndices;
        });
        const newTimersRef: number[] = [];
        const newQueryStatuses: string[] = [];

        lines.forEach((line, index) => {
            if (index < changeStartLineIndex) {
                newTimersRef.push(timersRef.current[index]);
                newQueryStatuses.push(recipeIngredientLineQueryStatus[index]);
                return;
            }
            const inlineIngredientIndices = newIngredientIndices.filter(
                (ingIdx) => ingIdx.line === index
            );
            const oldIndex = index + (oldLines.length - lines.length);
            if (line !== oldLines[oldIndex]) {
                newTimersRef.push(fetchSearchRecipeIngredientLine(line, inlineIngredientIndices));
                newQueryStatuses.push("loading");
                return;
            }
            newTimersRef.push(timersRef.current[oldIndex]);
            newQueryStatuses.push(recipeIngredientLineQueryStatus[oldIndex]);
            return;
        });
        const newTimersRefSet = new Set(newTimersRef);
        for (const oldTimer of timersRef.current) {
            if (!newTimersRefSet.has(oldTimer)) {
                clearTimeout(oldTimer);
            }
        }
        timersRef.current = newTimersRef;
        setRecipeIngredientLineQueryStatus(() => {
            return newQueryStatuses.map((status, index) => {
                if (lines[index] === "") {
                    return "loaded";
                }
                return status;
            });
        });
    };
    function handleClick(
        e: React.MouseEvent,
        word: string,
        ingredientIndex: IngredientIndex | undefined
    ) {
        e.stopPropagation();
        if (!ingredientIndex) {
            return;
        }
        setIngredientIndices((prev) => {
            return prev.map((prevIngIdx) => {
                if (
                    lodash.isEqual(
                        lodash.omit(prevIngIdx, ["clickedWord"]),
                        lodash.omit(ingredientIndex, ["clickedWord"])
                    )
                ) {
                    return {
                        ...prevIngIdx,
                        clickedWord: prevIngIdx.clickedWord ? null : word,
                    };
                }
                return {
                    ...prevIngIdx,
                    clickedWord: null,
                };
            });
        });
    }
    const handleDoubleClick = (start: number, end: number, lineNumber: number) => {
        const filterOutIngredientIndex = (
            ingredientIndices: IngredientIndex[],
            filterOut: IngredientIndex
        ): IngredientIndex[] => {
            return ingredientIndices.filter(
                (ingIdx) =>
                    ingIdx.start !== filterOut.start ||
                    ingIdx.end !== filterOut.end ||
                    ingIdx.line !== filterOut.line
            );
        };
        const existingIngredientIndex = ingredientIndices.find(
            (ingIdx) => ingIdx.start <= start && ingIdx.end >= end && ingIdx.line === lineNumber
        );
        if (existingIngredientIndex) {
            setIngredientIndices((prev) => {
                return filterOutIngredientIndex(prev, existingIngredientIndex);
            });
        } else {
            const line = recipeIngredientLines[lineNumber];
            const adjacentIngIdx = ingredientIndices.find(
                (ingIdx) =>
                    ingIdx.line === lineNumber &&
                    ((ingIdx.start - end === 1 && line[ingIdx.start - 1] === " ") ||
                        (start - ingIdx.end === 1 && line[start - 1] === " "))
            );
            if (adjacentIngIdx) {
                setIngredientIndices((prev) => {
                    return filterOutIngredientIndex(prev, adjacentIngIdx).concat({
                        clickedWord: null,
                        start: Math.min(adjacentIngIdx.start, start),
                        end: Math.max(adjacentIngIdx.end, end),
                        line: lineNumber,
                        selectedVarietyName: undefined,
                        specificOptionDescription: undefined,
                        searchRecipeIngredientDTO: undefined,
                    });
                });
            } else {
                setIngredientIndices((prev) => {
                    return [
                        ...prev,
                        {
                            clickedWord: null,
                            start: start,
                            end: end,
                            line: lineNumber,
                            selectedVarietyName: undefined,
                            specificOptionDescription: undefined,
                            searchRecipeIngredientDTO: undefined,
                        },
                    ];
                });
            }
            setRecipeIngredientLineQueryStatus((prev) => {
                const copy = [...prev];
                copy[lineNumber] = "loading";
                return copy;
            });
        }
    };

    function handleUserUpdatedIngredientIndex(
        newIngredientIndex: IngredientIndex,
        varietyChanged: boolean
    ) {
        setRecipeIngredientLineQueryStatus((prev) => {
            const copy = [...prev];
            copy[newIngredientIndex.line] = "loading";
            return copy;
        });
        updateWithNewIngredientIndices([
            varietyChanged
                ? {
                      ...newIngredientIndex,
                      clickedWord: null,
                      specificOptionDescription: undefined,
                      searchRecipeIngredientDTO: undefined,
                  }
                : newIngredientIndex,
        ]);
        const newInLineIngredientIndices = [
            ...ingredientIndices.filter((ingIdx) => {
                return !(
                    ingIdx.start === newIngredientIndex.start &&
                    ingIdx.end === newIngredientIndex.end &&
                    ingIdx.line === newIngredientIndex.line
                );
            }),
            newIngredientIndex,
        ].filter((ingIdx) => ingIdx.line === newIngredientIndex.line);
        timersRef.current[newIngredientIndex.line] = fetchSearchRecipeIngredientLine(
            recipeIngredientLines[newIngredientIndex.line],
            newInLineIngredientIndices
        );
    }

    const renderLeaf = useCallback(
        (props: any) => {
            const { attributes, children, leaf } = props;
            const ingredientIndex = ingredientIndices.find(
                (ingIdx) =>
                    ingIdx.start <= leaf.start &&
                    ingIdx.end >= leaf.end &&
                    ingIdx.line === leaf.line
            );
            let bgColor: string;
            if (!ingredientIndex) {
                bgColor = "";
            } else if (
                recipeIngredientLineQueryStatus[ingredientIndex.line] === "loading" &&
                ingredientIndex.searchRecipeIngredientDTO === undefined
            ) {
                bgColor = "bg-gray-300";
            } else if (ingredientIndex.searchRecipeIngredientDTO) {
                bgColor = "bg-green-300";
            } else {
                bgColor = "bg-red-300";
            }
            if (leaf.reactWord) {
                return (
                    <span className="relative">
                        <span
                            {...attributes}
                            className={`cursor-pointer ${bgColor}`}
                            onDoubleClick={() => handleDoubleClick(leaf.start, leaf.end, leaf.line)}
                            onClick={(e) => handleClick(e, leaf.text, ingredientIndex)}
                        >
                            {children}
                        </span>
                        {ingredientIndex &&
                            ingredientIndex.clickedWord === leaf.text &&
                            ingredientIndex.searchRecipeIngredientDTO && (
                                <div
                                    className="absolute bottom-full left-0 z-50 mb-3"
                                    contentEditable={false}
                                >
                                    <SearchRecipeIngredient
                                        key={`sri-${leaf.start}-${leaf.end}-${leaf.line}`}
                                        selectedVarietyName={ingredientIndex.selectedVarietyName}
                                        specificOptionDescription={
                                            ingredientIndex.specificOptionDescription
                                        }
                                        setSelectedVarietyName={(name: string) => {
                                            handleUserUpdatedIngredientIndex(
                                                {
                                                    ...ingredientIndex,
                                                    selectedVarietyName: name,
                                                    specificOptionDescription: undefined,
                                                },
                                                true
                                            );
                                        }}
                                        setSpecificOptionDescription={(description: string) => {
                                            handleUserUpdatedIngredientIndex(
                                                {
                                                    ...ingredientIndex,
                                                    specificOptionDescription: description,
                                                },
                                                false
                                            );
                                        }}
                                        searchRecipeIngredientDTO={
                                            ingredientIndex.searchRecipeIngredientDTO!
                                        }
                                    />
                                </div>
                            )}
                    </span>
                );
            } else {
                return (
                    <span {...attributes} className={`${bgColor}`}>
                        {children}
                    </span>
                );
            }
        },
        [ingredientIndices, recipeIngredientLineQueryStatus]
    );

    // Decorate the text to mark the word "react"
    const decorate = useCallback(([node, path]: NodeEntry<Node>) => {
        const ranges: any[] = [];
        if (Text.isText(node)) {
            const { text } = node;
            const regex = /\b(\w+)\b/g;
            let match;
            let lastIndex = 0;
            while ((match = regex.exec(text)) !== null) {
                if (match.index > lastIndex) {
                    ranges.push({
                        anchor: { path, offset: lastIndex },
                        focus: { path, offset: match.index },
                        start: lastIndex,
                        end: match.index,
                        line: path[0],
                        reactWord: false, // not a "reactWord"
                    });
                }
                ranges.push({
                    anchor: { path, offset: match.index },
                    focus: { path, offset: match.index + match[0].length },
                    start: match.index,
                    end: match.index + match[0].length,
                    line: path[0],
                    reactWord: true,
                });
                lastIndex = match.index + match[0].length;
            }
            if (lastIndex < text.length) {
                ranges.push({
                    anchor: { path, offset: lastIndex },
                    focus: { path, offset: text.length },
                    start: lastIndex,
                    end: text.length,
                    line: path[0],
                    reactWord: false,
                });
            }
        }
        return ranges;
    }, []);

    return (
        <div className="flex max-w-full">
            <div className="min-w-10 pt-2 ">
                {recipeIngredientLines.map((_, index) => {
                    const inLineIngredientIndices = ingredientIndices.filter(
                        (ingIdx) => ingIdx.line === index
                    );
                    return (
                        <div className=" flex items-center min-h-6 max-h-6 gap-x-1">
                            <LineColorStatus
                                key={`lcs-${index}`}
                                queryStatus={recipeIngredientLineQueryStatus[index]}
                                line={recipeIngredientLines[index]}
                                inLineIngredientIndices={inLineIngredientIndices}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="max-w-full">
                <Slate
                    editor={editor}
                    initialValue={initialValue}
                    onChange={() => {
                        handleChange();
                    }}
                >
                    <div className="flex border border-gray-400 rounded-xl max-w-full ">
                        <Editable
                            decorate={decorate}
                            renderLeaf={renderLeaf}
                            className=" p-2 w-80 focus:outline-none min-h-47 min-w-max "
                            placeholder="2 cups of flour"
                        />
                        <div className="pr-2 min-w-max ">
                            {recipeIngredientLines.map((_, index) => {
                                const inLineIngredientIndices = ingredientIndices.filter(
                                    (ingIdx) => ingIdx.line === index
                                );
                                return (
                                    <div
                                        className="text-md min-h-6 max-h-6 text-right font-extralight italic text-green-800 pt-2 whitespace-nowrap overflow-x-clip"
                                        style={{
                                            top: `${index * 1.5}rem`,
                                        }}
                                    >
                                        {inLineIngredientIndices.map((ingIdx, index) => (
                                            <span className="!m-0 !p-0">
                                                {ingIdx.searchRecipeIngredientDTO
                                                    ? ingIdx.searchRecipeIngredientDTO.ingredient
                                                          .selectedVariety.name
                                                    : "?"}
                                                {index < inLineIngredientIndices.length - 1
                                                    ? "; "
                                                    : ""}
                                            </span>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Slate>
            </div>
        </div>
    );
}

export default RecipeIngredientLineInputArea;
