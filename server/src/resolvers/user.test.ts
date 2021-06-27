import { gCall } from "../test-utils/gCall";
import { Connection } from "typeorm";
import { testConn } from "../test-utils/testConn"
import faker from "faker";
import { User } from "../entities/User";

let conn: Connection;
beforeAll(async () => {
    conn = await testConn();
})

afterAll(async () => {
    await conn.close();
})

const registerMutation = 
`mutation Register($options: UsernamePasswordInput!){
    register(options: $options) {
        errors {
            field
            message
         }
         user {
            id
            email
            username
            userType
         }
    }
}`

const meMutation = 
`{
    me{
        username
    }
}`



describe("Register", () => {
    it("dont allow duplicate user", async () => {

        const password = faker.internet.password();
        const options = {
            email: faker.internet.email(),
            username: faker.internet.userName(),
            password: password,
            confirmation: password,
        }

        
        const response = await gCall({
            source: registerMutation,
            variableValues: {
                options
            },
        });

        expect(response).toMatchObject({
            data: {
                register: {
                    errors: null,
                    user:{
                        email: options.email, 
                        username: options.username,
                        userType: "regular",
                    }
                }
            }
        });

        const dbUser = await User.findOne({ where: { email: options.email } });
        expect(dbUser).toBeDefined();
        expect(dbUser!.username).toBe(options.username);

        const copyResponse = await gCall({
            source: registerMutation,
            variableValues: {
                options
            },
        });

        expect(copyResponse).toMatchObject({
            data: {
                register: {
                    errors: [{
                        field: "username",
                        message: "username already taken"
                    }],
                    user:null
                }
            }
        });
    })
    
    it("then me query", async () => {
        const password = faker.internet.password();
        const username = faker.internet.userName();
        const options = {
            email: faker.internet.email(),
            username: username,
            password: password,
            confirmation: password,
        }
        
        const user = await gCall({
            source: registerMutation,
            variableValues: {
                options
            },
        });
    
        const res_me = await gCall({
            source: meMutation,
            userId: user?.data?.register.user.id
        });
    
        expect(res_me).toMatchObject({
            data: {
                me: {
                    username: username
                }
            }
        });
    })
    
    it("invalid email", async () => {
        const password = faker.internet.password();
        const options = {
            email: "notAnEmail",
            username: faker.internet.userName(),
            password: password,
            confirmation: password,
        }
        
        const response = await gCall({
            source: registerMutation,
            variableValues: {
                options
            },
        });

        expect(response).toMatchObject({
            data: {
                register: {
                    errors: [{
                        field: "email",
                        message: "Email invalido"
                    }],
                    user:null
                }
            }
        });
    })

    it("unmatching password and confirmation", async () => {
        const options = {
            email: faker.internet.email(),
            username: faker.internet.userName(),
            password: faker.internet.password(),
            confirmation: faker.internet.password(),
        }
        
        const response = await gCall({
            source: registerMutation,
            variableValues: {
                options
            },
        });

        expect(response).toMatchObject({
            data: {
                register: {
                    errors: [{
                        field: "confirmation",
                        message: "Las contraseñas no son iguales"
                    }],
                    user:null
                }
            }
        });
    })

    it("weak password", async () => {
        const password = "ok"
        const options = {
            email: faker.internet.email(),
            username: faker.internet.userName(),
            password: password,
            confirmation: password,
        }
        
        const response = await gCall({
            source: registerMutation,
            variableValues: {
                options
            },
        });

        expect(response).toMatchObject({
            data: {
                register: {
                    errors: [{
                        field: "password",
                        message: "El tamaño debe de ser mayor a 2"
                    }],
                    user:null
                }
            }
        });
    })
})

const getLoggedUserId = async () => {
    const password = faker.internet.password();
    const options = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: password,
        confirmation: password,
    }
    
    const user = await gCall({
        source: registerMutation,
        variableValues: {
            options
        },
    });

    return user?.data?.register.user.id; 
}


/*
  The porpuse of this test module is to test all the user functionality related
  to social media mipulation add and delete. 
*/
describe("Social Media", () => {
    const addSocialMediaMutation = 
      `mutation AddSocialMedia($social_media: String!, $link: String!){
          addSocialMedia(social_media: $social_media, link: $link)
      }`

    const deleteSocialMediaMutation = 
      `mutation DeleteSocialMedia($link: String!){
          deleteSocialMedia(link: $link)
      }`

    it("add without login", async () => {
        const response = await gCall({
            source: addSocialMediaMutation,
            variableValues: {
                social_media: "facebook",
                link: "facebook.com"
            },
        });

        expect(response).toMatchObject({
            data: {
                addSocialMedia: false
            }
        });
    })


    it("add with login", async () => {
        const response = await gCall({
            source: addSocialMediaMutation,
            variableValues: {
                social_media: "facebook",
                link: "facebook.com"
            },
            userId: await getLoggedUserId()
        });

        expect(response).toMatchObject({
            data: {
                addSocialMedia: true
            }
        });
    });

    it("delete without login", async () => {
        const link = "facebook.com";
        await gCall({
            source: addSocialMediaMutation,
            variableValues: {
                social_media: "facebook",
                link: link
            }
        });
        const response = await gCall({
            source: deleteSocialMediaMutation,
            variableValues: {
                link: link
            },
            userId: await getLoggedUserId()
        });

        expect(response).toMatchObject({
            data: {
                deleteSocialMedia: false
            }
        });
    })

    it("delete with empty link", async () => {
        const link = "";
        await gCall({
            source: addSocialMediaMutation,
            variableValues: {
                social_media: "facebook",
                link: link
            }
        });
        const response = await gCall({
            source: deleteSocialMediaMutation,
            variableValues: {
                link: link
            }
        });

        expect(response).toMatchObject({
            data: {
                deleteSocialMedia: false
            }
        });
    })

    it("delete with login", async () => {
        const link = "facebook.com";
        const userId = await getLoggedUserId();
        await gCall({
            source: addSocialMediaMutation,
            variableValues: {
                social_media: "facebook",
                link: link
            },
            userId: userId
        });
        const response = await gCall({
            source: deleteSocialMediaMutation,
            variableValues: {
                link: link
            },
            userId: userId
        });

        expect(response).toMatchObject({
            data: {
                deleteSocialMedia: true
            }
        });
    })

    it("delete other users", async () => {
        const link = "facebook.com";
        const userId1 = await getLoggedUserId();
        const userId2 = await getLoggedUserId();

        await gCall({
            source: addSocialMediaMutation,
            variableValues: {
                social_media: "facebook",
                link: link
            },
            userId: userId1
        });
        const response = await gCall({
            source: deleteSocialMediaMutation,
            variableValues: {
                link: link
            },
            userId: userId2
        });

        expect(response).toMatchObject({
            data: {
                deleteSocialMedia: false
            }
        });
    })
})

//saved products