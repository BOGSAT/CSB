import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  Response,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Request() req, @Response() res) {
    const token = await this.authService.signInWithGoogle(req.user);

    // Using res.cookie() from express
    res.cookie('access_token', token.access_token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Authentication successful' });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('Register endpoint hit');
    console.log('received data: ', registerDto);
    // Call the auth service to actually register the user
    return this.authService.register(registerDto);
  }

  @Post('google/verify')
  async verifyGoogleToken(@Body('idToken') idToken: string) {
    // Verify the Google ID token and process the user
    console.log('IdToken');
    const jwt = await this.authService.verifyGoogleToken(idToken);
    return jwt;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      // Validate user first
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );

      // Get JWT token
      const token = await this.authService.login(user);

      console.log('Login successful for user:', {
        userId: user._id,
        email: user.email,
        userName: user.userName,
      });

      // Return user data and token
      return {
        access_token: token,
        userId: user._id.toString(), // Convert ObjectId to string
        email: user.email,
        userName: user.userName,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
