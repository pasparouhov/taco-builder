import React from 'react';
import './App.css';
import 'react-table/react-table.css';
import IngredientSelect from './IngredientSelect';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Axios from './Axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from "@material-ui/core/ListItem";
import Delete from '@material-ui/icons/Delete';
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

let id = 0;

function App() {
    /** The names for each of the ingredients. Used for JSON objects. */
    const baseLayersName = "baseLayers";
    const mixinsName = "mixins";
    const condimentsName = "condiments";
    const shellsName = "shells";
    const seasoningsName = "seasonings";

    /** The max number of specific ingredients. */
    const maxItemsMixins = 3;
    const maxItemsCondiments = 2;
    const maxItemsSeasonings = 2;

    /** A state hook to keep track of what has been checked. */
    const [checked, setChecked] = React.useState({
        [baseLayersName]: [],
        [mixinsName]: [],
        [condimentsName]: [],
        [shellsName]: [],
        [seasoningsName]: [],
    });

    /** A state hook to keep track of errors. */
    const [error, setError] = React.useState("");

    /** A state hook to keep track of previously ordered tacos. */
    const [tacos, setTacos] = React.useState([]);

    /** A state hook to store data returned by endpoints. */
    const [data, setData] = React.useState({
        [baseLayersName]: [],
        [mixinsName]: [],
        [condimentsName]: [],
        [shellsName]: [],
        [seasoningsName]: [],
    });

    /** A effect hook that runs once when the page is loaded.
     *  Used to get ingredients.  */
    React.useEffect(() => {
        Axios.getData(response => {
            setData(response);
        });
    }, []);

    /** A method used to generate a sentence describing a
     * taco given checked ingredients.  */
    const generateTacoString = (checked) => {
        let result = `${checked[baseLayersName][0]} taco on ${checked[shellsName]} with `;
        result += `${generateIngredientString('mix in', checked[mixinsName])}, `;
        result += `${generateIngredientString('seasoning', checked[seasoningsName])}, and `;
        result += `${generateIngredientString('condiment', checked[condimentsName])}.`;
        return result;
    };

    /** A method to take a string array and an ingredient name to generate
     * a descriptor.  */
    const generateIngredientString = (name, array) => {
        if (array.length === 1) {
            return `${array[0]} ${name}`
        } else {

            let result = "";
            for (let i = 0; i < array.length - 2; i++) {
                result += `${array[i]}, `;
            }
            result += `${array[array.length - 2]} and ${array[array.length - 1]} ${name}s`;
            return result;
        }
    };

    /** A method passed to IngredientSelect component to keep track of
     * checked items.  */
    const handleToggle = (value, name, canHaveMultiple) => () => {
        const arrayCopy = {...checked};
        if (canHaveMultiple) {
            if (arrayCopy[name].includes(value)) {
                arrayCopy[name].splice(arrayCopy[name].indexOf(value), 1);
            } else {
                arrayCopy[name].push(value);
            }
        } else {
            arrayCopy[name] = [value];
        }

        setChecked(arrayCopy);
    };

    /** A method that takes the current checked state, generates an id
     * and adds it to the taco storage.  */
    const orderTaco = () => {
        if (!Object.keys(checked).every(item => checked[item].length > 0)) {
            setError("Must have at least one of every ingredient");
            return;
        }
        if (checked[condimentsName].length > maxItemsCondiments) {
            setError(`Max ${maxItemsCondiments} condiments`);
            return;
        } else if (checked[mixinsName].length > maxItemsMixins) {
            setError(`Max ${maxItemsMixins} mixins`);
            return;
        } else if (checked[seasoningsName].length > maxItemsSeasonings) {
            setError(`Max ${maxItemsMixins} mixins`);
            return;
        }
        setError('');
        const tacoWithId = {
            data: checked,
            id: id,
        };
        id++;
        setTacos([...tacos, tacoWithId]);
        setChecked({
            [baseLayersName]: [],
            [mixinsName]: [],
            [condimentsName]: [],
            [shellsName]: [],
            [seasoningsName]: [],
        });
    };

    /** A method that generates both an id and a random taco, and adds it
     * to the list of ordered tacos.  */
    const generateRandomTaco = () => {
        const taco = {
            data: {
                [baseLayersName]: [],
                [mixinsName]: [],
                [condimentsName]: [],
                [shellsName]: [],
                [seasoningsName]: [],
            },
            id: id,
        };
        id += 1;
        const keys = Object.keys(taco.data);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const randomIndex = Math.floor(Math.random() * data[key].length);
            taco.data[key].push(data[key][randomIndex].name);
        }
        setTacos([...tacos, taco]);
    };

    /** A method designed to take in a taco id and delete that taco. */
    const deleteTacoById = (id) => () => {
        const tacoCopy = [...tacos];
        for (let i = 0; i < tacoCopy.length; i++) {
            if (tacoCopy[i].id === id) {
                tacoCopy.splice(i, 1);
                break;
            }
        }
        setTacos(tacoCopy);
    };

    /** A check to see if the data has loaded. */
    const isLoaded = Object.keys(data).every(item => data[item].length !== 0);

    return (
        <div className="App">
            <header className="App-header">
                <p> Taco builder </p>
            </header>
            {isLoaded ?
                <Container>
                    <Row>
                        <Col>
                            <IngredientSelect
                                checked={checked[shellsName]}
                                onClick={handleToggle}
                                title={"Shells"}
                                index={0}
                                data={data.shells}
                                name={shellsName}
                            />
                            <IngredientSelect
                                checked={checked[condimentsName]}
                                onClick={handleToggle}
                                title={"Condiments"}
                                index={3}
                                data={data.condiments}
                                canHaveMultiple
                                maxItems={maxItemsCondiments}
                                name={condimentsName}
                            />
                        </Col>
                        <Col>
                            <IngredientSelect
                                checked={checked[baseLayersName]}
                                onClick={handleToggle}
                                title={"Base Layers"}
                                index={1}
                                data={data.baseLayers}
                                name={baseLayersName}
                            />
                        </Col>
                        <Col>
                            <IngredientSelect
                                checked={checked[mixinsName]}
                                onClick={handleToggle}
                                title={"Mix Ins"}
                                index={2}
                                data={data.mixins}
                                canHaveMultiple
                                maxItems={maxItemsMixins}
                                name={mixinsName}
                            />
                            <IngredientSelect
                                checked={checked[seasoningsName]}
                                onClick={handleToggle}
                                title={"Seasonings"}
                                index={4}
                                data={data.seasonings}
                                canHaveMultiple
                                maxItems={maxItemsSeasonings}
                                name={seasoningsName}
                            />
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="contained" color="primary" onClick={orderTaco}>
                                Order Taco
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="contained" color="primary" onClick={generateRandomTaco}>
                                Generate Taco
                            </Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <p style={{textAlign: 'center'}}> Your Tacos: </p>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <List key={'taco-list'} width={1/8}>
                                    {tacos.map(taco => {
                                        const labelId = `label-taco-${taco.id}`;

                                        return (
                                            <ListItem key={`taco-${taco.id}-item`}
                                                      role={undefined}
                                                      dense
                                                      alignItems={'center'}>

                                                <ListItemText id={labelId} primary={generateTacoString(taco.data)} />
                                                <ListItemSecondaryAction>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        onClick={deleteTacoById(taco.id)}>
                                                        <Delete />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        );
                                    })}

                                </List>
                            </div>
                        </Col>
                    </Row>
                    <br/>
                </Container>
                :
                <div>
                    <br/>
                    <CircularProgress size={80}/>
                </div>
            }

        </div>
    );
}

export default App;
