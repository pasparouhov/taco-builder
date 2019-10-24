import axios from 'axios';

const baseUrl = "https://ct-tacoapi.azurewebsites.net";

class Axios {

    async getData(callback) {
        const data = {};
        data.baseLayers = (await axios.get(`${baseUrl}/baseLayers`)).data;
        data.mixins = (await axios.get(`${baseUrl}/mixins`)).data;
        data.condiments = (await axios.get(`${baseUrl}/condiments`)).data;
        data.shells = (await axios.get(`${baseUrl}/shells`)).data;
        data.seasonings = (await axios.get(`${baseUrl}/seasonings`)).data;
        callback(data);
    }
}

export default new Axios();
