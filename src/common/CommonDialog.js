import React, { useEffect } from 'react';
import styled from "styled-components";
import { Dialog } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CommonButton from './CommonButton';

const DialogStyle = styled(Dialog)`
    & .MuiPaper-root {
        min-width: 300px;
        border-radius: 8px;
    }
`;

const TitleBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 16px;
    border-bottom: 1px solid ${(props) => props.theme.color.grey};
    box-sizing: border-box;
`;

const TitleStyle = styled.div`
    font-size: ${(props) => props.theme.fontSize.md};
    color: ${(props) => props.theme.color.black};
    font-weight: 800;
`;

const IconButton = styled.button`
    background: transparent;
    padding: 0px;
    border: none;
    cursor: pointer;
`;

const ContentsBox = styled.div`
    padding: 16px;
    box-sizing: border-box;
`;

const ControllBox = styled.div`
    padding: 0 16px 16px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CommonDialog = ({
    open,
    onClose,
    onClick,
    title,
    children,
    onKeyDown
}) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                onClose();
            }
        };

        if (open) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClose]);

    return (
        <DialogStyle onClose={onClose} open={open} onKeyDown={onKeyDown}>
            <TitleBox>
                <TitleStyle>{title}</TitleStyle>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </TitleBox>
            <ContentsBox>
                {children}
            </ContentsBox>
            <ControllBox>
                <CommonButton onClick={onClose} height={"35px"} children={"확인"} fontSize={"12px"} />
            </ControllBox>
        </DialogStyle>
    );
};

export default CommonDialog;