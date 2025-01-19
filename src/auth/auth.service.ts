import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: any) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload);

    // Return both token and user data
    return {
      access_token,
    };
  }

  async googleLogin(req: any) {}

  async signInWithGoogle(user: any): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateGoogleUser(googleUser: any) {
    let user = await this.usersService.findByEmail(googleUser.email);

    if (!user) {
      user = await this.usersService.create({
        email: googleUser.email,
        userName: googleUser.name,
        password: '',
      });
    }
    return user;
  }

  async verifyGoogleToken(idToken: string) {
    // // console.log('verifyGoogleTokenStart');
    // console.log(process.env.GOOGLE_CLIENT_ID);
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    // console.log(googleClient);
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      console.log('verifyGoogleTokenMiddle');
      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }
      const { email, name, picture } = payload;

      // const user = await this.findOrCreateUser({ email, name, picture });

      const user = await this.usersService.findByEmail(email);
      console.log('verifyGoogleTokenEnd');
      const payload2 = { sub: user._id.toString(), email: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload2),
        userId: user._id.toString(),
      };
    } catch (error) {
      console.error('Error verifying Google token:', error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async register(registerDto: RegisterDto) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
    console.log('Original password:', registerDto.password);
    console.log('Hashed password:', hashedPassword);

    const newUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return {
      message: 'User successfully registered',
      userId: newUser._id.toString(),
      email: newUser.email,
    };
  }

  // Update signIn method to use bcrypt
  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    console.log('Login attempt with:', { email, password });

    const user = await this.usersService.findByEmail(email);
    console.log('Found user:', user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials - user not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid credentials - password incorrect',
      );
    }

    const payload = { sub: user._id.toString(), email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
