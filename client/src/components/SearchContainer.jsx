import React from 'react';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { JOB_SORT_BY, JOB_TYPE, JOB_STATUS } from '../../../utils/constant';
import { useAllJobsContext } from '../pages/AllJobs';
import { Form, Link, useSubmit } from 'react-router-dom';
import FormRow from './FormRow';
import FormRowSelect from './FormRowSelect';

const SearchContainer = () => {
	const { searchValues } = useAllJobsContext();
	const { search, jobStatus, jobType, sort } = searchValues;
	const submit = useSubmit();

	const debounce = (onChange) => {
		let timeout;
		return (e) => {
			const form = e.currentTarget.form;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				onChange(form);
			}, 2000);
		}
	}

	return (
		<Wrapper>
			<Form className='form'>
				<h5 className="form-title">Search Form</h5>
				<div className="form-center">
					<FormRow
						type='search'
						name='search'
						defaultValue={search}
						onChange = {debounce((form) => {
							submit(form)
						})}
					/>

					<FormRowSelect
						labelText='Job Status'
						name='jobStatus'
						list={['all', ...Object.values(JOB_STATUS)]}
						defaultValue={jobStatus}
						onChange = {(e) => {
							submit(e.currentTarget.form)
						}}
					/>

					<FormRowSelect
						labelText='Job Type'
						name='jobType'
						list={['all', ...Object.values(JOB_TYPE)]}
						defaultValue={jobType}
						onChange = {(e) => {
							submit(e.currentTarget.form)
						}}
					/>

					<FormRowSelect
						name='sort'
						list={[...Object.values(JOB_SORT_BY)]}
						defaultValue={sort}
						onChange = {(e) => {
							submit(e.currentTarget.form)
						}}
					/>

					<Link to='/dashboard/all-jobs' className='btn form-btn delete-btn'>
						Reset Search Values
					</Link>
				</div>
			</Form>
		</Wrapper>
	)
}

export default SearchContainer;