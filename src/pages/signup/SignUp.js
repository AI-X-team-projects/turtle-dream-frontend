import React, {useState} from 'react';
import styled from 'styled-components';
import CommonRoot from '../../common/CommonRoot';
import CommonTextField from '../../common/CommonTextField';
import CommonButton from '../../common/CommonButton';

const Root = styled(CommonRoot)`
    & > input {
        margin-bottom: 10px;
    }
    & button {
        margin-top: 14px;
    }
`;

const TitleStyle = styled.p`
    margin: 0;
    font-size: ${(props) => props.theme.fontSize.xxl};
    color: ${(props) => props.theme.color.green};
    font-weight: 800;
    text-align: center;
    margin-bottom: 30px;
`;

const Box = styled.div`
    width: 346px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const TextStyle = styled.p`
    margin: 0;
    font-size: ${(props) => props.theme.fontSize.xs};
    color: ${(props) => props.theme.color.red};
    font-weight: bold;
    text-align: center;
`;

const SingUp = () => {
    const [selected, setSelected] = useState("남");

    const InputProps = {
        width: '346px',
    };

    const ButtonProps = {
        width: '50px',
        height: '50px',
        fontSize: "16px;"
    };

    return (
        <Root>
            <TitleStyle>회원가입</TitleStyle>
            <Box>
                <CommonTextField
                    placeholder={"아이디"}
                    width={"245px"}
                />
                <CommonButton 
                    width={"90px"} 
                    height={"50px"}
                    children={"중복 확인"}
                    fontSize={"16px"}
                />
            </Box>
            <CommonTextField
                type={"password"}
                placeholder={"비밀번호"}
                {...InputProps}
            />
            <CommonTextField
                type={"password"}
                placeholder={"비밀번호 확인"}
                {...InputProps}
            />
            <Box>
                <CommonTextField
                    placeholder={"이름"}
                    width={"228px"}
                />
                <CommonButton 
                    outline={selected === "남" ? false : true}
                    children={"남"}
                    onClick={() => setSelected("남")}
                    {...ButtonProps}
                />
                <CommonButton
                    outline={selected === "여" ? false : true}
                    children={"여"}
                    onClick={() => setSelected("여")}
                    {...ButtonProps}
                />
            </Box>
            <Box>
                <CommonTextField
                    placeholder={"나이"}
                    width={"168px"}
                />
                <CommonTextField
                    placeholder={"키"}
                    width={"168px"}
                />
            </Box>
            <TextStyle>중복된 아이디가 있습니다.</TextStyle>
            <CommonButton width={"346px"} children={"register"}/>
        </Root>
    );
};

export default SingUp;