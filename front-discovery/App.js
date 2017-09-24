import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ChatBot from 'react-native-chatbot';



var steps = [
                { id: 'start',
                  message: 'What would you like to learn about?',
                  trigger: 'search',
                },{ id: 'search', 
                  user: true, 
                  trigger: 'send' //next_steps()
                },{ id: 'send', 
                  message: get_message({previousValue}), 
                  trigger: suggestionsOrComponent({previousValue})
                }
            ];
var next = null; 
var nextnext = null; 

function get_message(question) {
  const response = await fetch("https://slackifyapp.burnished12.hasura-app.io/" + question); 
  const message_object = await response.text(); 
  if (message_object) {
    // const templateresponse = {"message": "", "embed": {"message": "", "url": ""}, "suggestions": []}; 
    var message = message_object.message; 

    if (message_object.embed.message != "" && message_object.embed.url != "") {
      // set next to be this embed 
      next = message_object.embed; 
    }

    if (message_object.suggestions.length > 0) {
      // set nextnext to be this suggest.
      nextnext = message_object.suggest
    }
  } else {
    console.log("hasura-app, message_object didn't work"); 
  }

  return message; 
}

function suggestionsOrComponent() {

  return 'start'
}


export default class App extends React.Component {


  render() {
    return (<View style={styles.container}>
                <ChatBot steps={steps} />
            </View> );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
