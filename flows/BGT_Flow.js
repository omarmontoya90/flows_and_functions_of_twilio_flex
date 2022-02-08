{
  "description": "Bogotá Flow",
    "states": [
      {
        "name": "Trigger",
        "type": "trigger",
        "transitions": [
          {
            "next": "welcome",
            "event": "incomingMessage"
          },
          {
            "event": "incomingCall"
          },
          {
            "event": "incomingRequest"
          }
        ],
        "properties": {
          "offset": {
            "x": 0,
            "y": 0
          }
        }
      },
      {
        "name": "Welcome",
        "type": "send-and-wait-for-reply",
        "transitions": [
          {
            "next": "Options",
            "event": "incomingMessage"
          },
          {
            "event": "timeout"
          },
          {
            "event": "deliveryFailure"
          }
        ],
        "properties": {
          "offset": {
            "x": 10,
            "y": 210
          },
          "service": "{{trigger.message.InstanceSid}}",
          "channel": "{{trigger.message.ChannelSid}}",
          "from": "{{flow.channel.address}}",
          "body": "Hola bienvenido a nuestro sistema desde GitHub, cuentanos en que podemos ayudarte?",
          "timeout": "3600"
        }
      },
      {
        "name": "Options",
        "type": "split-based-on",
        "transitions": [
          {
            "next": "GoodBye",
            "event": "noMatch"
          },
          {
            "next": "SaleAdviser",
            "event": "match",
            "conditions": [
              {
                "friendly_name": "Value equal_to asesoria",
                "arguments": [
                  "{{widgets.welcome.inbound.Body}}"
                ],
                "type": "equal_to",
                "value": "asesoria"
              }
            ]
          }
        ],
        "properties": {
          "input": "{{widgets.welcome.inbound.Body}}",
          "offset": {
            "x": 20,
            "y": 480
          }
        }
      },
      {
        "name": "GoodBye",
        "type": "send-message",
        "transitions": [
          {
            "event": "sent"
          },
          {
            "event": "failed"
          }
        ],
        "properties": {
          "offset": {
            "x": -240,
            "y": 1020
          },
          "service": "{{trigger.message.InstanceSid}}",
          "channel": "{{trigger.message.ChannelSid}}",
          "from": "{{flow.channel.address}}",
          "to": "{{contact.channel.address}}",
          "body": "Fue un placer atenderte"
        }
      },
      {
        "name": "SaleAdviser",
        "type": "send-message",
        "transitions": [
          {
            "event": "sent"
          },
          {
            "event": "failed"
          }
        ],
        "properties": {
          "offset": {
            "x": 210,
            "y": 740
          },
          "service": "{{trigger.message.InstanceSid}}",
          "channel": "{{trigger.message.ChannelSid}}",
          "from": "{{flow.channel.address}}",
          "to": "{{contact.channel.address}}",
          "body": "Hola estas comunicado con tu asesor de ventas. En un momento atiendo tu solicitud."
        }
      }
    ],
    "initial_state": "Trigger",
    "flags": {
      "allow_concurrent_calls": true
    }
}
