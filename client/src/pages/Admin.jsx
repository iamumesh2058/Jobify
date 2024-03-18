import React from 'react';
import { FaSuitcaseRolling, FaCalendarCheck } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/StatsContainer';
import { useLoaderData, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { StatItem } from '../components';

export const loader = async () => {
	try {
		const response = await customFetch.get('/users//admin/app-stats');
		return response.data;
	} catch (error) {
		toast.error('You are not authorized to view this page');
		return redirect('/dashboard');
	}
}

const Admin = () => {
	const { users, jobs } = useLoaderData();

	return (
		<Wrapper>
			<StatItem 
				title='Current Users' 
				count={users} 
				color='#e9b949' 
				bcg='#fcefc7' 
				icon={<FaSuitcaseRolling />}
			/>

			<StatItem 
				title='Total Jobs' 
				count={jobs} 
				color='#647acb' 
				bcg='#e0e8f9' 
				icon={<FaCalendarCheck />}
			/>
		</Wrapper>
	)
}

export default Admin