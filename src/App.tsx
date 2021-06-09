import React, { useEffect } from "react"
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useTranslation } from "react-i18next";
import { Redirect, Switch } from "react-router";
import { Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Settings from "./components/Settings";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import history from "./helpers/history";
import useTheme from "./hooks/useTheme";
import useFindUser from "./hooks/useFindUser";
import { UserContext } from "./hooks/UserContext";
import { ThemeContext } from "./hooks/ThemeContext";
import { AuthContext } from "./hooks/AuthContext";
import useFindAuth from "./hooks/useFindAuth";
import { AccountsContext } from "./hooks/AccountsContext";
import useFindAccounts from "./hooks/useFindAccounts";
import NewAccount from "./components/NewAccount";
import AccountComponent from "./components/Account";
import Transfer from "./components/Transfer";
import Withdraw from "./components/Withdraw";
import Deposit from "./components/Deposit";

NProgress.configure({
	minimum: 0.1,
	easing: "ease",
	speed: 800,
	showSpinner: false,
});

const App = () => {
	const { auth, setAuth } = useFindAuth()
	const { user, setUser, isLoading: userIsLoading } = useFindUser();
	const { accounts, setAccounts, isLoading: accountsIsLoading } = useFindAccounts()
	const { theme, themeIcon, setTheme, toggleTheme } = useTheme()

	const canvasElements = document.getElementsByTagName("canvas")

	for (let i = 0; i < canvasElements.length; i++) {
		const element = canvasElements.item(i);
		if (element) {
			element.remove()
		}
	}

	useEffect(() => {
		const unlisten = history.listen((location, action) => {
			if (!NProgress.isStarted())
				NProgress.start();
			console.log(`route ${location.pathname} state ${action}`)
			NProgress.done();
		})
	  
		return () => {
			unlisten()
		}
	}, [])
	
	return <AuthContext.Provider value={{ auth, setAuth }}>
		<UserContext.Provider value={{ user, setUser, isLoading: userIsLoading }}>
			<AccountsContext.Provider value={{ accounts, setAccounts, isLoading: accountsIsLoading }}>
				<ThemeContext.Provider value={{ theme, themeIcon, setTheme, toggleTheme }}>
					<div className="dark:bg-gray-800 bg-gray-100 h-full w-full p-2 transition-all space-y-2">
						<Header />
						<Switch>
							<Route path="/settings">
								<Settings />
							</Route>
							
							<Route exact path="/account">
								{
									user 
										? <NewAccount /> 
										: <Redirect to="/" />
								}
							</Route>

							<Route exact path="/account/:id">
								<AccountComponent /> 

								{/* {
									user 
										? <AccountComponent /> 
										: <Redirect to="/" />
								} */}
							</Route>

							<Route exact path="/transfer/:id">
								<Transfer />
							</Route>

							<Route exact path="/withdraw/:id">
								<Withdraw />
							</Route>

							<Route exact path="/deposit/:id">
								<Deposit />
							</Route>

							<Route path="/register">
								{
									user 
										? <Redirect to="/" />
										: <Register /> 
								}
							</Route>

							<Route exact path="/">
								{
									user 
										? <Dashboard /> 
										: <Login />
								}
							</Route>

							<Route path="*">
								<Redirect to="/" />
							</Route>
						</Switch>
					</div>
				</ThemeContext.Provider>
			</AccountsContext.Provider>
		</UserContext.Provider>
	</AuthContext.Provider>
}

export default App;
