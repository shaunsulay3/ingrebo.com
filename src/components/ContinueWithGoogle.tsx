type ContinueWithGoogleProps = {
    className?: string;
};

export default function ContinueWithGoogle({ className }: ContinueWithGoogleProps) {
    return (
        <button
            className={`
                ${className} 
                w-full flex items-center justify-center gap-3 
                px-4 py-2 rounded-md 
                border border-gray-300 bg-white 
                text-sm font-medium text-gray-800 
                hover:bg-gray-100 
                cursor-pointer
            `}
            onClick={() => (window.location.href = import.meta.env.VITE_GOOGLE_OAUTH_URL)}
        >
            <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-4 h-4"
            />
            Continue with Google
        </button>
    );
}
