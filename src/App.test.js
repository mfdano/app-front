import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { screen, prettyDOM, fireEvent, waitFor, cleanup  } from '@testing-library/react';
import { act } from "react-dom/test-utils";

import App from './App';
import Api from './Api';
import { messages, labels } from './copy';

let container = null;
let warn = null; 
let spyGetCountries, spyGetCities, spyGetStates;
const countries = [
  { id: '611481f7d6c82f3278c8aff4', name: 'CountryA' },
  { id: '611481f7d6c82f3378c8aff4', name: 'CountryB' },
];

const cities = [
  { id: '611481f7d6c82f3279c8aff4', name: 'CityA' },
  { id: '611481f7d6c82f3279c8aff3', name: 'CityB' },
];

const states = [
  { id: '611481f7d6c82f3279c8aff2', name: 'StateA' },
  { id: '611481f7d6c82f3279c8aff1', name: 'StateB' },
];

beforeAll(() => {
  warn = console.warn;
  console.warn = () => {};
})

afterAll(() => {
  console.warn = warn;
})

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  jest.clearAllMocks();
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('When app starts up', () => {
  it("it renders form", () => {
    act(() => {
      render(<App />, container);
    });

    expect(container.textContent).toContain(labels.formTitle);
    expect(container.textContent).toContain(labels.selectCityPhldr);
    expect(container.textContent).toContain(labels.selectCountryPhldr);
    expect(container.textContent).toContain(labels.selectStatePhldr);
  });
  
  it("it renders countries data", async () => {
    spyGetCountries = jest.spyOn(Api, 'getCountries').mockResolvedValue(countries);

    await act(async () => {
      render(<App />, container);
      await waitFor(() => expect(spyGetCountries).toHaveBeenCalledTimes(1));
    });
  
    await act(async () => {
      const select = document.querySelector('#countries-select');
      fireEvent.mouseDown(select);
    });

    expect(spyGetCountries).toHaveBeenCalled();
    for (let country of countries) {
      expect(screen.getByText(new RegExp(country.name, 'i'))).toBeInTheDocument();
    }
  });
});

describe('When clicks send without inputs data', () => {
  it("it renders error messages", async () => {
    spyGetCountries = jest.spyOn(Api, 'getCountries').mockResolvedValue(countries);

    await act(async () => {
      render(<App />, container);
      await waitFor(() => expect(spyGetCountries).toHaveBeenCalledTimes(1));
    });
  
    await act(async () => {
      const button = document.querySelector('#send-btn');
      fireEvent.click(button);
    });

    expect(screen.getByText(new RegExp(messages.errorOnName, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(messages.errorOnAge, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(messages.errorOnCountry, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(messages.errorOnState, 'i'))).toBeInTheDocument();
    //expect(screen.getByText(new RegExp(messages.errorOnCity, 'i'))).toBeInTheDocument();
  });
});