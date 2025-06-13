import {useEffect, useState} from "react";
import {get} from "@/api";

const Dashboard = () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [data, setData] = useState<any>();

	useEffect(() => {
		get('test/')
			.then((data) => {
				console.log('Data fetched successfully:', data);
				setData(data);
			})
			.catch(error => {
				console.error('Error fetching data:', error);
			});
	}, []);

	return (
		<div className="home">
			<h1>Welcome to the Dashboard</h1>
			{data ? (
				<div>
					<h2>Data from API:</h2>
					<pre>{JSON.stringify(data, null, 2)}</pre>
				</div>
			) : (
				<p>Loading data...</p>
			)}
		</div>
	);
}

export default Dashboard;