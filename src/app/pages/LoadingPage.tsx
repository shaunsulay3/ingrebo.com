export default function LoadingPage({ message = "Loading..." }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full py-20">
            <img src="/logo-character.svg" className="w-20" />
            <p className="mt-2">{message}</p>
        </div>
    );
}
