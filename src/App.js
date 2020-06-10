/*
 * Author Antto Hautam�ki
 */
import React from 'react';
import './App.css'
import MainComponent from './MainComponent'

class App extends React.Component {

    constructor(props) {
        super(props)
        //S�teeksi voi asentaa v�lit 10-3000m
        this.state = {
            range: 3000
        };
    }

    //Asettaa et�isyyden
    set(e) {
        this.setState({ range: e.target.value })
    }

    render() {

        return (
            <>
                <MainComponent />
            </>
        );
    }
}

export default App;

