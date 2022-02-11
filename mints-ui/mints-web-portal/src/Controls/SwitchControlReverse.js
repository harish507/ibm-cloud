import { Switch, withStyles } from '@material-ui/core'

const SwitchControlReverse = withStyles(theme => ({
    root: {
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
        //marginTop: 7,
    },
    switchBase: {
        padding: 2,
        color: theme.palette.common.white,
        '&$checked': {
            transform: 'translateX(12px)',
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                backgroundColor: theme.palette.grey[500],
                borderColor: theme.palette.grey[500],
            },
        },
    },
    thumb: {
        width: 12,
        height: 12,
        boxShadow: 'none',
    },
    track: {
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 16 / 2,
        opacity: 1,
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main
    },
    checked: {},
}))(Switch);

export default SwitchControlReverse