import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    signUp() {
        return {
            message: 'I have signed up.'
        }
    }

    signIn() {
        return {
            message: 'I have signed in.'
        }
    }
}
