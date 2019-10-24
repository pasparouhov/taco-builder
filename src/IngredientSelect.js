import React from 'react';
import './App.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import 'bootstrap/dist/css/bootstrap.min.css';
import FormHelperText from '@material-ui/core/FormHelperText';

class IngredientSelect extends React.Component{
    render() {

        const classes = {
            root: {
                width: '100%',
                maxWidth: 360,
            }
        };
        const {
            checked,
            onClick,
            title,
            index,
            data,
            canHaveMultiple,
            maxItems,
        } = this.props;
        let finalTitle = title;
        if (maxItems) {
            finalTitle = `${title} (max ${maxItems} items)`
        }
        let error = 'hidden';
        if (maxItems < checked.length) {
            error = 'visible';
        }
        return (
            <div style={classes.root}>
                <br/>
                <p style={{ color: 'blue' }}> {finalTitle} </p>
                <FormHelperText error={true} style={{visibility: error}}>
                    {`Can only have up to ${maxItems} selected`}
                </FormHelperText>
                <List>
                    {data.map(value => {
                        const labelId = `label-${value.slug}`;

                        return (
                            <ListItem key={value}
                                      role={undefined}
                                      dense
                                      button
                                      onClick={onClick(value.name, index, canHaveMultiple)}>
                                <ListItemIcon>
                                    { canHaveMultiple ?
                                        <Checkbox
                                            edge="start"
                                            checked={checked.includes(value.name)}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{'aria-labelledby': labelId}}
                                        />
                                        :
                                        <Radio
                                            edge="start"
                                            checked={checked.includes(value.name)}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{'aria-labelledby': labelId}}
                                        />
                                    }
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={value.name} />
                            </ListItem>
                        );
                    })}
                </List>
            </div>

        );
    }
}

export default IngredientSelect;
