/*
 * Author Antto Hautamäki
 */
import React from 'react';
import './App.css'
import MainComponent from './MainComponent'

class App extends React.Component {

    constructor(props) {
        super(props)
        //Säteeksi voi asentaa välit 10-3000m
        this.state = {
            range: 3000
        };
    }

    //Asettaa etäisyyden
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

