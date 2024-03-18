import React, { createContext, useContext, useState } from 'react';
import Wrapper from '../assets/wrappers/Dashboard';
import { BigSidebar, Navbar, SmallSidebar, Loading } from '../components';
import { Outlet, redirect, useNavigate, useNavigation } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { useQuery } from "@tanstack/react-query";


const userQuery = {
    queryKey: ['user'],
    queryFn: async () => {
        const { data } = await customFetch.get('/users/current-user');
        return data;
    }
}


export const loader = (queryClient) => async () => {
    try {
        return await queryClient.ensureQueryData(userQuery);
    } catch (error) {
        return redirect('/');
    }
}

const DashboardContext = createContext();

const DashboardLayout = ({ isDarkThemeEnabled, queryClient }) => {
    const { user } = useQuery(userQuery).data;
    const navigate = useNavigate();
    const navigation = useNavigation();
    const isPageLoading = navigation.state === 'loading';

    const [showSidebar, setShowSidebar] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(isDarkThemeEnabled);

    const toggleDarkTheme = () => {
        const newDarkTheme = !isDarkTheme;
        setIsDarkTheme(newDarkTheme);
        document.body.classList.toggle('dark-theme', newDarkTheme);
        localStorage.setItem('darkTheme', newDarkTheme);
    }

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    }

    const logoutUser = async () => {
        navigate('/');
        const { data } = await customFetch.get('/auth/logout');
        queryClient.invalidateQueries();
        toast.success(data?.msg);
    }

    return (
        <DashboardContext.Provider
            value={{
                user,
                showSidebar,
                isDarkTheme,
                toggleDarkTheme,
                toggleSidebar,
                logoutUser
            }}
        >
            <Wrapper>
                <main className="dashboard">
                    {
                        showSidebar ?
                            <SmallSidebar />
                            :
                            <></>
                    }
                    <BigSidebar />
                    <div>
                        <Navbar />
                        <div className="dashboard-page">
                            {
                                isPageLoading ? <Loading /> :
                                    <Outlet context={{ user }} />
                            }
                        </div>
                    </div>
                </main>
            </Wrapper>
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => useContext(DashboardContext)
export default DashboardLayout;