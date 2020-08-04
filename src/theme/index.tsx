import { createMuiTheme } from '@material-ui/core/styles';
import { red, purple, green } from "@material-ui/core/colors";

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: purple[500],
        },
        secondary: {
            main: green[500],
        },
        error: {
            main: red[400]
        },
        common: {
            white: '#FFF'
        }
    },
    typography: {
        h5: {
            fontSize: 30,
            fontWeight: 'bold',
            margin: 0
        }
    }
});