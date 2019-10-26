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
        /** A JSON object storing some styling things. */
        const classes = {
            root: {
                width: '100%',
                maxWidth: 360,
            }
        };

        /** Checked is the currently checked.
         * onClick is the function ran when a item is clicked.
         * title is the title for the section.
         * data is the data pulled from the API.
         * canHaveMultiple is a self-explanatory boolean.
         * maxItems is the max number of items that can be selected.
         * name is the JSON object name for data storage. */
        const {
            checked,
            onClick,
            title,
            data,
            canHaveMultiple,
            maxItems,
            name,
        } = this.props;

        /** Change the title if there is a max number of items. */
        let finalTitle = maxItems ? `${title} (max ${maxItems} items)` : title;

        /** Make error visible if too many items are checked. */
        let error = maxItems < checked.length ? 'visible' :'hidden';

        return (
            <div style={classes.root}>
                <br/>
                <p style={{ color: 'blue' }}> {finalTitle} </p>
                <FormHelperText error={true} style={{visibility: error}}>
                    {`Can only have up to ${maxItems} selected`}
                </FormHelperText>
                <List key={title}>
                    {data.map(value => {
                        const labelId = `label-${value.slug}`;

                        return (
                            <ListItem key={`${value.slug}-item`}
                                      role={undefined}
                                      dense
                                      button
                                      onClick={onClick(value.name, name, canHaveMultiple)}>
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
