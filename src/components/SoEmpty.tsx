export default function SoEmpty({ className }: { className?: string }) {
    return (
        <div className={`${className} flex flex-col items-center justify-center h-full w-full`}>
            <img src="/logo-character.svg" className="w-20" />
            <p className="mt-2">So empty...</p>
        </div>
    );
}
