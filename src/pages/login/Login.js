import React from 'react';
import styled from 'styled-components';
import CommonButton from '../../common/CommonButton';

const Root = styled.div`
    width: 100%;
`;

const RootIn = styled.div`

`;


const Login = () => {
    return (
        <Root>
            
            <RootIn>
                <CommonButton width={"346px"} children={"로그인"}/>
            </RootIn>
        </Root>
    );
};

export default Login;