/* eslint-disable quotes */
// create metadata for all the available functions to pass to completions API
const tools = [
  // {
  //   type: 'function',
  //   function: {
  //     name: 'checkInventory',
  //     say: 'Let me check our inventory right now.',
  //     description: 'Check the inventory of airpods, airpods pro or airpods max.',
  //     parameters: {
  //       type: 'object',
  //       properties: {
  //         model: {
  //           type: 'string',
  //           'enum': ['airpods', 'airpods pro', 'airpods max'],
  //           description: 'The model of airpods, either the airpods, airpods pro or airpods max',
  //         },
  //       },
  //       required: ['model'],
  //     },
  //     returns: {
  //       type: 'object',
  //       properties: {
  //         stock: {
  //           type: 'integer',
  //           description: 'An integer containing how many of the model are in currently in stock.'
  //         }
  //       }
  //     }
  //   },
  // },
  // {
  //   type: 'function',
  //   function: {
  //     name: 'checkPrice',
  //     say: 'Let me check the price, one moment.',
  //     description: 'Check the price of given model of airpods, airpods pro or airpods max.',
  //     parameters: {
  //       type: 'object',
  //       properties: {
  //         model: {
  //           type: 'string',
  //           'enum': ['airpods', 'airpods pro', 'airpods max'],
  //           description: 'The model of airpods, either the airpods, airpods pro or airpods max',
  //         },
  //       },
  //       required: ['model'],
  //     },
  //     returns: {
  //       type: 'object',
  //       properties: {
  //         price: {
  //           type: 'integer',
  //           description: 'the price of the model'
  //         }
  //       }
  //     }
  //   },
  // },
  {
    type: 'function',
    function: {
      name: 'placeOrder',
      say: 'All right, I\'m just going to ring that up in our system.',
      description: 'Places an order for a set of shoes, after double confirmed with the customer.',
      parameters: {
        type: 'object',
        properties: {
          order: {
            type: 'string',
            description: 'The order summary including model of shoes, price, shipping method and information',
          },
          number: {
            type: 'string',
            description: 'The user phone number in E.164 format',
          },
        },
        required: ['order', 'number'],
      },
     
    },
  },

  // {
  //   type: 'function',
  //   function: {
  //     name: 'transferCall',
  //     say: 'One moment while I transfer your call.',
  //     description: 'Transfers the customer to a live agent in case they request help from a real person.',
  //     parameters: {
  //       type: 'object',
  //       properties: {
  //         callSid: {
  //           type: 'string',
  //           description: 'The unique identifier for the active phone call.',
  //         },
  //       },
  //       required: ['callSid'],
  //     },
  //     returns: {
  //       type: 'object',
  //       properties: {
  //         status: {
  //           type: 'string',
  //           description: 'Whether or not the customer call was successfully transfered'
  //         },
  //       }
  //     }
  //   },
  // },

  {
    type: 'function',
    function: {
      name: "getWeather",
      description: "Get the current weather for a given location.",
      say: 'Let me check the weather for you.',
      parameters: {
        type: "object",
        properties: {
          location: { type: "string", description: "The city name (e.g., London, Paris)." },
        },
        required: ["location"],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: "changeLanguage",
      description: "Change the current conversation language to user preference, treat en-US, en-GB, es-ES, es-MX etc. as different languages.",
      // say: 'Let me check the weather for you.',
      parameters: {
        type: "object",
        properties: {
          language: { type: "string", description: "The language codes preferred by the user and should be changed to, the format like en-US, fr-FR etc. If the user requests language without specifying the region, default to the system's initial language with region if they are the same." },
        },
        required: ["language"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "verifySend",
      //say: "Sending the code now.",
      description: "Generates and sends a verification code via SMS to the phone number provided",
      parameters: {
        type: "object",
        properties: {
          phone: {
            type: "string",
            description: "The phone number to send the verification code to"
          }
        },
        required: [
          "phone"
        ]
      }
    }
  },
  
  {
    type: "function",
    function: {
      name: "verifyCode",
      //say: "Verifying the code.",
      description: "Verifies a provided code",
      parameters: {
        type: "object",
        properties: {
          code: {
            type: "string",
            description: "The verification code to check, provided by the customer"
          },
          phone: {
            type: "string",
            description: "The phone number of the customer in the customer profile"
          }
        },
        required: [
          "code",
          "phone"
        ]
      }
    }
  },

  {
    type: "function",
    function: {
      name: "scheduleMove",
      say: "One moment, organizing your move now.",
      description: "Schedules the move for a customer",
      parameters: {
        type: "object",
        properties: {
          new_address: {
            type: "string",
            description: "The new address the customer is moving to"
          },
          moving_date: {
            type: "string",
            description: "The date the customer is moving to the new address (YYYY-MM-DD). **Convert any relative date expressions to this format based on {{currentDate}}.**"
          },
          new_energy_plan_type: {
            type: "string",
            enum: ["electricity_and_gas", "electricity_only"],
            description: "The new energy plan type at the new address"
          },
          phone: {
            type: "string",
            description: "The phone number of the customer in the customer profile"
          }
        },
        required: [
          "new_address",
          "moving_date",
          "new_energy_plan_type",
          "phone"
        ]
      }
    }
  },

  {
    type: "function",
    function: {
      name: "liveAgentHandoff",
      //say: "One moment, transferring you to a live agent now",
      description: "Transfers the call to a live agent",
      parameters: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            description: "A brief reason for the transfer"
          }
        },
        required: [
          "reason"
        ]
      }
    }
  },

  {
    type: "function",
    function: {
      name: "verifyDOB",
      //say: "One moment, transferring you to a live agent now",
      description: "Verifies the customer's date of birth",
      parameters: {
        type: "object",
        properties: {
          dob_from_customer: {
            type: "string",
            description: "The date of birth provided by the customer (YYYY-MM-DD)."
          },
          dob_customer_profile: {
            type: "string",
            description: "The date of birth in the customer profile"
          }
        },
        required: [
          "dob_from_customer",
          "dob_customer_profile"
        ]
      }
    }
  }
];

module.exports = tools;