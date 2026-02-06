import ExplorePage from "../app/pages/ExplorePage";
import LandingPage from "../app/pages/LandingPage";
import { useAuth } from "../contexts/AuthContext";
import Layout from "./Layout";

export default function HomeGate() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <LandingPage />;
    }

    return (
        <Layout>
            <ExplorePage />
        </Layout>
    );
}
