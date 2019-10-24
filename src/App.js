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

    const [checked, setChecked] = React.useState([[],[],[],[],[]]);
    const [error, setError] = React.useState("");
    const [tacos, setTacos] = React.useState([]);
    const [data, setData] = React.useState({
        baseLayers: [],
        mixins: [],
        condiments: [],
        shells: [],
        seasonings: [],
    });

    const generateTacoString = (checked) => {
        return "Taco!"
    };
    const handleToggle = (value, index, canHaveMultiple) => () => {
        const arrayCopy = checked.map(item => [...item]);
        if (canHaveMultiple) {
            if (arrayCopy[index].includes(value)) {
                arrayCopy[index].splice(arrayCopy[index].indexOf(value), 1);
            } else {
                arrayCopy[index].push(value);
            }
        } else {
            arrayCopy[index] = [value];
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

    React.useEffect(() => {
        Axios.getData(response => {
            setData(response);
        });
    }, []);
    const isLoaded = Object.keys(data).every(item => {
            return data[item].length !== 0;
        }
    );
    const id = 0;
    const orderTaco = () => {
        const tacoWithId = {
            data: checked,
            id: tacos.length,
        };
        setTacos([...tacos, tacoWithId]);
        setChecked([[],[],[],[],[]]);
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
                                checked={checked[0]}
                                onClick={handleToggle}
                                title={"Shells"}
                                index={0}
                                data={data.shells}
                            />
                            <IngredientSelect
                                checked={checked[3]}
                                onClick={handleToggle}
                                title={"Condiments"}
                                index={3}
                                data={data.condiments}
                                canHaveMultiple
                                maxItems={2}
                            />
                        </Col>
                        <Col>
                            <IngredientSelect
                                checked={checked[1]}
                                onClick={handleToggle}
                                title={"Base Layers"}
                                index={1}
                                data={data.baseLayers}
                            />
                        </Col>
                        <Col>
                            <IngredientSelect
                                checked={checked[2]}
                                onClick={handleToggle}
                                title={"Mix Ins"}
                                index={2}
                                data={data.mixins}
                                canHaveMultiple
                                maxItems={3}
                            />
                            <IngredientSelect
                                checked={checked[4]}
                                onClick={handleToggle}
                                title={"Seasonings"}
                                index={4}
                                data={data.seasonings}
                                canHaveMultiple
                                maxItems={2}
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
