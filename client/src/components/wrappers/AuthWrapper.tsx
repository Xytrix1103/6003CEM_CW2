// Component wrapper for real-time protection
import {type ReactNode, useContext} from "react";
import {Navigate} from "react-router";
import {AuthContext} from "@/components/contexts";

const AuthWrapper = ({children}: { children: ReactNode }) => {
	const {currentUser} = useContext(AuthContext);
	return currentUser ? children : <Navigate to="/login" replace/>;
};

export default AuthWrapper;