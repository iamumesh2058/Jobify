import React from 'react';
import { FaBug, FaCalendarCheck, FaSuitcase } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/StatsContainer';
import StatItem from './StatItem';

const StatsContainer = ({ defaultStats }) => {
	const stats = [
		{
			title: 'pending applications',
			count: defaultStats?.pending || 0,
			icon: <FaSuitcase />,
			color: '#f59e0b',
			bcg: '#fef3c7'
		},
		{
			title: 'Interview Scheduled',
			count: defaultStats?.interview || 0,
			icon: <FaCalendarCheck />,
			color: '#647abc',
			bcg: '#e0e8f9'
		},
		{
			title: 'Jobs Declined',
			count: defaultStats?.declined || 0,
			icon: <FaBug />,
			color: '#d66a6a',
			bcg: '#ffeeee'
		},
	]
	return (
		<Wrapper>
			{
				stats.map((item) => {
					return <StatItem key={item.title} {...item} />
				})
			}
		</Wrapper>
	)
}

export default StatsContainer;