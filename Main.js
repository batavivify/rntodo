import React, {Component} from 'react';
import { connect } from 'react-redux';
import {ScrollView, View, Text} from 'react-native';

type Props = {};

class Main extends Component<Props> {


    render() {

        return(
            <ScrollView>
                <View>
                    <Text> App + Redux init (Build is working! :) ) </Text>
                </View>
            </ScrollView>
        );

    }

}


export default connect() (Main);