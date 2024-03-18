import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import Wrapper from '../assets/wrappers/ErrorPage';
import img from '../assets/images/not-found.svg';

const Error = () => {
    const error = useRouteError();
    return (
        <>
            {
                error.status === 404 ?
                    <Wrapper>
                        <div>
                            <img src={img} alt="not found" />
                            <h3>Ohh! page not found</h3>
                            <p>We can't seem to find the page you are looking for</p>
                            <Link to={'/dashboard'}>Back to home</Link>
                        </div>
                    </Wrapper>
                    :
                    <Wrapper>
                        <div>
                            <h3>Something went wrong</h3>
                        </div>
                    </Wrapper>
            }
        </>
    )
}

export default Error;