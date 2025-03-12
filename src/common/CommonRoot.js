import styled from 'styled-components';

const CommonRoot = styled.div`
 width: 100%;
    min-height: ${(props) => `calc(100vh - ${props.theme.headerHeight})`};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export default CommonRoot;