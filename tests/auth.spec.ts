import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import TestData from '../data/testData.json';
import { DashboardPage } from '../pages/dashboardPage';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.visitarPaginaLogin();
});

test('Test 1.1 : Login Exitoso y Redirección al Dashboard', async ({ page }) => {
  await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
  await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
  await expect(dashboardPage.dashboardTitle).toBeVisible();
  await expect(page).toHaveURL(/.*\/dashboard/);
});


test('Test 2.1 : Intento de Login con Credenciales Inválidas', async ({ page }) => {
  await loginPage.completarYHacerClickBotonLogin(TestData.usuarioInvalido);
  await expect(page.getByText('Invalid credentials')).toBeVisible();
  await expect(page).toHaveURL(/.*\/login/);
});

test('Test 2.2 : Intento de Login con Campos Vacíos', async ({ page }) => {
  await loginPage.hacerClickBotonLogin();
  // Captura y valida el mensaje del navegador
  const validationMsg = await loginPage.emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
  // La validación depende del idioma del navegador
  expect(validationMsg).toMatch(/Completa este campo|Please fill out this field/i);
  await expect(page).toHaveURL(/\/login$/);
});

test('Test 2.3 : Intento de Login con Email sin Contraseña', async ({ page }) => {
await loginPage.completarFormularioLogin(TestData.usuarioSinPass);
  // Captura y valida el mensaje del navegador
  const validationMsg = await loginPage.passwordInput.evaluate((el: HTMLInputElement) => el.validationMessage);
  // La validación depende del idioma del navegador
  expect(validationMsg).toMatch(/Completa este campo|Please fill out this field/i);
  // Asegura que aún estás en la página de login
  await expect(page).toHaveURL(/\/login$/);
});


test('Test 2.4 :  Intento de Login con Formato de Email Incorrecto', async ({ page }) => {
  await loginPage.completarYHacerClickBotonLogin(TestData.usuarioEmailSinFormato);
  // Captura y valida el mensaje del navegador
  const validationMsg = await loginPage.emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
  expect(validationMsg).toMatch(/introduce texto.*@|Please enter a part following '@'/i);
  // Asegura que aún estás en la página de login
  await expect(page).toHaveURL(/\/login$/);
});


test('Test 3.1: Vericación del Enlace de Registro', async ({ page }) => {
  await loginPage.RedirigiraSignUp();
  await expect(page).toHaveURL(/\/signup$/);
});

test('Test 3.2: Cierre de Sesión y Protección de Rutas', async ({ page }) => {
await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
await dashboardPage.userlogOut()
await expect(page).toHaveURL(/\/login$/);
await page.goto('http://localhost:3000/dashboard'); 
await expect(page).toHaveURL(/\/login$/);
});