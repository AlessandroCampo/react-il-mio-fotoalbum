import { Autocomplete, TextField } from "@mui/material";

export default function ({ searchValue, selectedValue, handleInputChange, handleOptionSelected, options }) {




    return <Autocomplete
        freeSolo
        className="w-full"
        disableClearable
        options={options}
        groupBy={(option) => option.type}
        onChange={handleOptionSelected}
        getOptionLabel={(option) => option.label || ''}
        inputValue={searchValue}
        value={selectedValue}
        onInputChange={handleInputChange}
        renderInput={(params) => (
            <TextField
                {...params}
                placeholder="Search"
                InputProps={{
                    ...params.InputProps,
                    type: 'search',
                    sx: {
                        color: 'white',
                        border: 'none',
                        height: '40px',
                        '&:before': { border: 'none' },
                        '&:after': { border: 'none' },
                        '&:hover:not(.Mui-disabled):before': { border: 'none' },
                    }
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { border: 'none' },
                        '&:hover fieldset': { border: 'none' },
                        '&.Mui-focused fieldset': { border: 'none' },
                        color: 'white',
                    },
                    input: { color: 'lightslategray' }
                }}
            />
        )}
        sx={{ color: 'white' }}
    />
}