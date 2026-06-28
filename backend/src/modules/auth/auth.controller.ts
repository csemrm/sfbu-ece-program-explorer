import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const COOKIE_NAME = 'admin_token';
const COOKIE_TTL_MS = 24 * 60 * 60 * 1000;

interface AuthReq {
  user: { id: string; email: string; role: string };
}

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const user = await this.authService.validateCredentials(
      dto.email,
      dto.password,
    );
    const token = this.authService.signToken(user);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: COOKIE_TTL_MS,
      secure: process.env.NODE_ENV === 'production',
    });
    return { user: { id: user.id, email: user.email, role: user.role } };
  }

  @Post('logout')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logout(@Res({ passthrough: true }) res: any) {
    res.clearCookie(COOKIE_NAME);
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: AuthReq) {
    return req.user;
  }
}
