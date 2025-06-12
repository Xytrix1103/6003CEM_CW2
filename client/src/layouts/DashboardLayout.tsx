import {useContext} from 'react';
import {Navigate, Outlet} from 'react-router';
import {AuthContext} from "@/components/contexts";

const DashboardLayout = () => {
	const {currentUser} = useContext(AuthContext);

	// Secondary protection for real-time auth changes
	if (!currentUser) return <Navigate to="/login" replace/>;

	return (
		<div className="dashboard">
			<div className="content">
				<Outlet/> {/* Nested routes render here */}
			</div>
		</div>
	);
};

export default DashboardLayout;