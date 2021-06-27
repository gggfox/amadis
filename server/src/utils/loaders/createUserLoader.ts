import DataLoader from "dataloader";
import { User } from "../../entities/User";

// [1, 7, 8, 9]
//[{id: 1, username: 'tim'},{},{},{}]

/*
  hace una query de SQL para todos los 
  usuarios 1 sola vez envez de hacerlo
  para cada usario del main page
*/
//.i
export const createUserLoader = () => new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userIdToUser: Record<number, User> = {};
    users.forEach((user) => {
        userIdToUser[user.id] = user;
    });
    return userIds.map((userId) => userIdToUser[userId]);
});