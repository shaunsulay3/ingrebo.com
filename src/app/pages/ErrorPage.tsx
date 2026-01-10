export default function ErrorPage({
    message = "Uh oh... Something went wrong. Please try again later.",
}: {
    message?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <img src="/logo-character.svg" className="w-20" />
            <p className="mt-2">{message}</p>
        </div>
    );
}
