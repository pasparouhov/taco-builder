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

function App() {

    const [checked, setChecked] = React.useState([[],[],[],[],[]]);
    const [data, setData] = React.useState({
        baseLayers: [],
        mixins: [],
        condiments: [],
        shells: [],
        seasonings: [],
    });
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

    React.useEffect(() => {
        Axios.getData(response => {
            setData(response);
        });
    }, []);
    const isLoaded = Object.keys(data).every(item => {
            return data[item].length !== 0;
        }
    );
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
