import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo } from '@/api/users'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import store from '@/store'
import { IUserData } from '@/api/types'
import { users } from '@/users'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
  info: IUserData | null
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public info: IUserData | null = null

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_INFO(info: IUserData) {
    this.info = { ...info }
  }

  @Action
  public Login(userInfo: { username: string, password: string }) {
    let { username, password } = userInfo
    username = username.trim()
    const user = users.find((u: any) => u.username === username)

    if (user && user.password === password) {
      setToken('any')
      this.SET_TOKEN('any')
      this.SET_NAME(user.username)
    } else {
      throw Error('User not found')
    }
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }

    const user = users.find((u: any) => u.username === this.name)
    if (!user) {
      throw Error('User not found')
    }

    this.SET_ROLES([ user.role ])
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    // await logout({})
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
