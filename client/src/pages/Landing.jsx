import React from 'react';
import Wrapper from '../assets/wrappers/LandingPage';
import main from '../assets/images/main.svg';
import { Link } from 'react-router-dom';
import { Logo } from '../components';

const Landing = () => {
    return (
        <Wrapper>
            <nav>
                <Logo />
            </nav>
            <div className='container page'>
                <div className="info">
                    <h1>
                        job <span>tracking</span> app
                    </h1>
                    <p>
                        In today's fast-paced world, connecting job seekers with the right opportunities efficiently is crucial. Enter Jobify, the innovative platform reshaping the landscape of employment connections. With its user-friendly interface and cutting-edge algorithms, Jobify streamlines the job search process like never before.
                    </p>
                    <Link to="/register" className='btn register-link'>Register</Link>
                    <Link to="/login" className='btn'>Login / Demo User</Link>
                </div>
                <img src={main} alt='job hunt' className='img main-img' />
            </div>
        </Wrapper>
    )
}

export default Landing;