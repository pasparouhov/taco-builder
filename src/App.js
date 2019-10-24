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
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Delete from '@material-ui/icons/Delete';
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

function App() {
    const baseLayersName = "baseLayers";
    const mixinsName = "mixins";
    const condimentsName = "condiments";
    const shellsName = "shells";
    const seasoningsName = "seasonings";
    const maxItemsMixins = 3;
    const maxItemsCondiments = 2;
    const maxItemsSeasonings = 2;

    const [checked, setChecked] = React.useState({
        [baseLayersName]: [],
        [mixinsName]: [],
        [condimentsName]: [],
        [shellsName]: [],
        [seasoningsName]: [],
    });
    const [error, setError] = React.useState("");
    const [tacos, setTacos] = React.useState([]);
    const [data, setData] = React.useState({
        [baseLayersName]: [],
        [mixinsName]: [],
        [condimentsName]: [],
        [shellsName]: [],
        [seasoningsName]: [],
    });

    React.useEffect(() => {
        Axios.getData(response => {
            setData(response);
        });
    }, []);

    const generateTacoString = (checked) => {
        return "Taco!";
    };


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

    const isLoaded = Object.keys(data).every(item => {
            return data[item].length !== 0;
        }
    );


    let id = 0;
    const orderTaco = () => {
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
                    <Row>
                        {error && <p style={{ color: 'red' }}>`Error: ${error}`</p>}
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="contained" color="primary" onClick={orderTaco}>
                                Order Taco
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="contained" color="primary">
                                Generate Taco
                            </Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <p style={{textAlign: 'center'}}> Your Tacos: </p>
                    </Row>
                    <Row className="justify-content-md-center">

                        <div style={{display: 'flex', justifyContent: 'center'}}>
                        <List key={'taco-list'} width={1/4}>
                            {tacos.map(taco => {
                                const labelId = `label-taco-${taco.id}`;

                                return (
                                    <ListItem key={`taco-${taco.id}-item`}
                                              role={undefined}
                                              dense
                                              alignItems={'center'}>

                                        <ListItemText id={labelId} primary={generateTacoString(taco.data)} />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="delete" onClick={deleteTacoById(taco.id)}>
                                                <Delete />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })}

                        </List>
                        </div>
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
