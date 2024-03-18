import React from 'react';
import { Form, useOutletContext, redirect } from 'react-router-dom';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { FormRow, SubmitBtn } from '../components';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constant';
import FormRowSelect from '../components/FormRowSelect';


export const action = async ({ request }) => {
	const formData = await request.formData();
    const data = Object.fromEntries(formData);
	try {
		await customFetch.post('/jobs/createjob', data);
		toast.success('Job added successfully')
		return redirect('/dashboard/all-jobs');
	} catch (error) {
		toast.error(error?.response?.data?.msg);
        return error;
	}
}


const AddJob = () => {
	const { user } = useOutletContext();

	return (
		<Wrapper>
			<Form method='post' className='form'>
				<h4 className='form-title'>Add job</h4>
				<div className='form-center'>
					<FormRow type='text' name='position' />
					<FormRow type='text' name='company' />
					<FormRow
						type='text'
						labelText='Job Location'
						name="jobLocation"
						defaultValue={user.location}
					/>

					<FormRowSelect 
						labelText={'Job Status'}
						name='jobStatus'
						defaultValue={JOB_STATUS.PENDING}
						list={Object.values(JOB_STATUS)}
					/>

					<FormRowSelect 
						labelText={'Job Type'}
						name='jobType'
						defaultValue={JOB_TYPE.PENDING}
						list={Object.values(JOB_TYPE)}
					/>

					<SubmitBtn formBtn />
				</div>

			</Form>
		</Wrapper>
	)
}

export default AddJob;