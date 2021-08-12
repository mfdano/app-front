const ApiUrl = "http://localhost:5000/api";

/**
 * Makes one http request to API
 * 
 * @param {string} param method - the http request method (POST | GET | DELETE | UPDATE)
 * @param {string} param path - the path of specific service.
 * @param {string} param params - the body params of the request
 * 
 * @return {JSON} Returns the json response of the request
 * 
 */
async function makeRequest(method, path, params) {
  const response = await fetch(`${ApiUrl}/${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: params
  });

  if (response.status === 500) throw new Error('Error de servidor');
  return response.json();
}

/**
 * Creates the http request to get the List of countries
 * 
 * @return {JSON} Returns the json response with the list of countries
 * 
 */
async function getCountries() {
  const result = await makeRequest('GET', 'countries', null);
  return result;
}

/**
 * Creates the http request to get the List of states corresponding to one country
 * 
 * @param {number} param countryId - the identifier of the country to get its states
 * 
 * @return {JSON} Returns the json response with the list of states 
 * 
 */
async function getStates(countryId) {
  const result = await makeRequest('GET', `${'states'}?countryId=${countryId}`);
  return result;
}

/**
 * Creates the http request to get the List of cities corresponding to one state
 * 
 * @param {number} param stateId - the identifier of the state to get its countries
 * 
 * @return {JSON} Returns the json response with the list of countries 
 * 
 */
async function getCities(stateId) {
  const result = await makeRequest('GET', `${'cities'}?stateId=${stateId}`);
  return result;
}

/**
 * Creates the http request to post a new user
 * 
 * @param {string} param name - the name of the user
 * @param {number} param age - the age of the user
 * @param {number} param cityId - the city identifier of the user
 * 
 * @return {JSON} Returns the json response
 * 
 */
async function postUser(name, age, cityId) {
  const body = JSON.stringify({
    cityId: cityId,
    name: name,
    age: age
  });
  
  const result = await makeRequest('POST', 'users', body);
  return result;
}

const Api = { getCountries, getStates, getCities, postUser };

export default Api;