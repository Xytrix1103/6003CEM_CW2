import {Outlet} from "react-router-dom";

function App() {
    return (
        <div className="App">
            {/*<Navbar/>*/}
            <main>
                <h1 className="text-2xl font-bold text-center my-4">Welcome to My App</h1>
                <Outlet/>
            </main>
        </div>
    );
}

export default App;