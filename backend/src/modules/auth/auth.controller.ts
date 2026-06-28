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

interface CookieRes {
  cookie(name: string, value: string, options: Record<string, unknown>): void;
  clearCookie(name: string): void;
}

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: CookieRes,
  ) {
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
  logout(@Res({ passthrough: true }) res: CookieRes) {
    res.clearCookie(COOKIE_NAME);
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: AuthReq) {
    return req.user;
  }
}
