import { TextField } from '@mui/material';
import styled from '@emotion/styled';

export const InputTextField = styled(TextField)({
    width: '75%',
    height: '43px',

    ' .MuiOutlinedInput-root': {
        color: '#7c7c7c',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'center',
        outline: 'none',
        borderRadius: '20px',
        height: '43px',
    },
});
