export const sampleChats = [
  {
    avatar: [
      "https://th.bing.com/th?id=OIP.Ck2Usj84bIh_SiI2QJ7b-QHaEp&w=315&h=198&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    ],
    name: "Sathya",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: [
      "https://th.bing.com/th?id=OIP.Ck2Usj84bIh_SiI2QJ7b-QHaEp&w=315&h=198&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    ],
    name: "Harry",
    _id: "2",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: [
      "https://th.bing.com/th?id=OIP.Ck2Usj84bIh_SiI2QJ7b-QHaEp&w=315&h=198&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
      "https://th.bing.com/th?id=OIP.Ck2Usj84bIh_SiI2QJ7b-QHaEp&w=315&h=198&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
      "https://th.bing.com/th?id=OIP.Ck2Usj84bIh_SiI2QJ7b-QHaEp&w=315&h=198&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    ],
    name: "Group Chat",
    _id: "3",
    groupChat: true,
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    avatar:
      "https://th.bing.com/th?id=OIP.Ck2Usj84bIh_SiI2QJ7b-QHaEp&w=315&h=198&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",

    name: "Vasanth",
    _id: "1",
  },
  {
    avatar:
      "https://th.bing.com/th/id/OIP.wxTUrQda0yWUHqzMSKBehgHaHf?w=183&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    name: "Sasee",
    _id: "2",
  },
];

export const sampleNotifications = [
  {
    sender: {
      avatar:
        "https://th.bing.com/th?id=OIP.Ck2Usj84bIh_SiI2QJ7b-QHaEp&w=315&h=198&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
      name: "Vasanth",
    },
    _id: "1",
  },
  {
    sender: {
      avatar:
        "https://th.bing.com/th/id/OIP.wxTUrQda0yWUHqzMSKBehgHaHf?w=183&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      name: "Sasee",
    },
    _id: "2",
  },
];

export const sampleMessage = [
  {
    attachments: [
      {
        public_id: "adee",
        url: "https://i.pinimg.com/originals/e1/0f/3e/e10f3e750c307740402e2e314b3d0e27.jpg",
      },
    ],
    content: "Hii..This is my chat app",
    _id: "ijugebyigbyedhbcy",
    sender: {
      _id: "user._id",
      name: "Sathya",
    },
    chat: "chatId",
    createdAt: "2024-03-13T01:00:30.630Z",
  },
  {
    attachments: [
      {
        public_id: "adee2",
        url: "https://w0.peakpx.com/wallpaper/882/196/HD-wallpaper-vikram-movie-rolex-surya-painting.jpg",
      },
    ],
    content: "Hii..This is my chat app 2",
    _id: "ijugebyigbyedhbcy2ww2",
    sender: {
      _id: "uibi",
      name: "Vasanth",
    },
    chat: "chatId2",
    createdAt: "2024-03-13T02:33:30.630Z",
  },
  {
    attachments: [],
    content: "Hii..This is my chat app 33333",
    _id: "ijugebyigbyedhbcy2ww2d",
    sender: {
      _id: "uibixcd",
      name: "Vasanth SSS",
    },
    chat: "chatId3",
    createdAt: "2024-03-13T02:33:30.630Z",
  },
];

export const dashboardData = {
  users: [
    {
      name: "Vasanth",
      avatar:
        "https://th.bing.com/th?id=OIP.Ck2Usj84bIh_SiI2QJ7b-QHaEp&w=315&h=198&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
      _id: "1",
      username: "v_a_m_pi_r_e",
      friends: 20,
      groups: 7,
    },
    {
      name: "Sasee",
      avatar:
        "https://th.bing.com/th/id/OIP.wxTUrQda0yWUHqzMSKBehgHaHf?w=183&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      _id: "2",
      username: "s_a_s_e_e",
      friends: 10,
      groups: 5,
    },
  ],

  chats: [
    {
      name: "Group 1",
      avatar: [
        "https://i.pinimg.com/originals/e1/0f/3e/e10f3e750c307740402e2e314b3d0e27.jpg",
      ],
      _id: "1",
      groupChat: false,
      members: [
        {
          _id: "1",
          avatar:
            "https://i.pinimg.com/originals/e1/0f/3e/e10f3e750c307740402e2e314b3d0e27.jpg",
        },
        {
          _id: "2",
          avatar:
            "https://i.pinimg.com/originals/e1/0f/3e/e10f3e750c307740402e2e314b3d0e27.jpg",
        },
      ],
      totalMembers: 2,
      totalmessages: 20,
      creator: {
        name: "Vasanth",
        avatar:
          "https://th.bing.com/th?id=OIP.Ck2Usj84bIh_SiI2QJ7b-QHaEp&w=315&h=198&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
      },
    },
    {
      name: "Group 2",
      avatar: [
        "https://w0.peakpx.com/wallpaper/882/196/HD-wallpaper-vikram-movie-rolex-surya-painting.jpg",
      ],
      _id: "2",
      groupChat: true,
      members: [
        {
          _id: "1",
          avatar:
            "https://w0.peakpx.com/wallpaper/882/196/HD-wallpaper-vikram-movie-rolex-surya-painting.jpg",
        },
        {
          _id: "2",
          avatar:
            "https://w0.peakpx.com/wallpaper/882/196/HD-wallpaper-vikram-movie-rolex-surya-painting.jpg",
        },
      ],
      totalMembers: 2,
      totalmessages: 20,
      creator: {
        name: "Sasee",
        avatar:
          "https://th.bing.com/th/id/OIP.wxTUrQda0yWUHqzMSKBehgHaHf?w=183&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      },
    },
  ],

  messages: [
    {
      attachments: [],
      content: "Hii..This is my chat app1",
      _id: "ijugebyigbyedhbcy",
      sender: {
        avatar:
          "https://th.bing.com/th/id/OIP.wxTUrQda0yWUHqzMSKBehgHaHf?w=183&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        name: "Sathya",
      },
      chat: "chatId",
      groupchat: true,
      createdAt: "2024-03-13T01:00:30.630Z",
    },
    {
      attachments: [
        {
          public_id: "adee2",
          url: "https://w0.peakpx.com/wallpaper/882/196/HD-wallpaper-vikram-movie-rolex-surya-painting.jpg",
        },
      ],
      content: "Hii..This is my chat app2",
      _id: "ijugebyigbyedhbcycr",
      sender: {
        avatar:
          "https://th.bing.com/th/id/OIP.wxTUrQda0yWUHqzMSKBehgHaHf?w=183&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        name: "SathyaPk",
      },
      chat: "chatId",
      groupchat: false,
      createdAt: "2024-03-13T01:00:30.630Z",
    },
    {
      attachments: [
        {
          public_id: "adee2",
          url: "https://w0.peakpx.com/wallpaper/882/196/HD-wallpaper-vikram-movie-rolex-surya-painting.jpg",
        },
      ],
      content: "Hii..This is my chat app2",
      _id: "ijugebyigbyedhbcycr",
      sender: {
        avatar:
          "https://th.bing.com/th/id/OIP.wxTUrQda0yWUHqzMSKBehgHaHf?w=183&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        name: "SathyaPk",
      },
      chat: "chatId",
      groupchat: false,
      createdAt: "2024-03-13T01:00:30.630Z",
    },
    {
      attachments: [
        {
          public_id: "adee2",
          url: "https://w0.peakpx.com/wallpaper/882/196/HD-wallpaper-vikram-movie-rolex-surya-painting.jpg",
        },
      ],
      content: "Hii..This is my chat app2",
      _id: "ijugebyigbyedhbcycr",
      sender: {
        avatar:
          "https://th.bing.com/th/id/OIP.wxTUrQda0yWUHqzMSKBehgHaHf?w=183&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        name: "SathyaPk",
      },
      chat: "chatId",
      groupchat: false,
      createdAt: "2024-03-13T01:00:30.630Z",
    },
  ],
};
