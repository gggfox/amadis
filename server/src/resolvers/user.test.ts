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

const registerMutation = `
mutation Register($options: UsernamePasswordInput!){
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
  }
`
describe("Register", () => {
    it("dont allow duplicate user", async () => {
        
        const options = {
            email: faker.internet.email(),
            username: faker.internet.userName(),
            password: faker.internet.password()
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

        console.log(copyResponse);

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
    

    it("invalid email", async () => {
        
        const options = {
            email: "notAnEmail",
            username: faker.internet.userName(),
            password: faker.internet.password()
        }

        
        const response = await gCall({
            source: registerMutation,
            variableValues: {
                options
            },
        });

        console.log(response.data?.register)

        // expect(response).toMatchObject({
        //     data: {
        //         register: {
        //             errors: null,
        //             user:{
        //                 email: options.email, 
        //                 username: options.username,
        //                 userType: "regular",
        //             }
        //         }
        //     }
        // });

      

  
    })
})