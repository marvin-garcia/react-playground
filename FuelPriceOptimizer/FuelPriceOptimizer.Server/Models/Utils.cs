using System.Text;

namespace FuelPriceOptimizer.Server.Models
{
    public class Utils
    {
        public static string GeneratePassword()
        {
            // Define character sets
            string uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string digits = "0123456789";
            string specialCharacters = "!@#$%^&*()-=_+[]{}|;:'\"<>,.?/";

            // Randomly choose characters from each set
            char firstChar = GetRandomChar(uppercaseLetters);
            string letters = GetRandomString(uppercaseLetters, 3);
            string digitsPart = GetRandomString(digits, 4);
            char specialChar = GetRandomChar(specialCharacters);

            // Combine parts to form the password
            string generatedPassword = $"{firstChar}{letters}{digitsPart}{specialChar}";

            return generatedPassword;
        }

        private static char GetRandomChar(string characterSet)
        {
            Random random = new Random();
            int index = random.Next(characterSet.Length);
            return characterSet[index];
        }

        private static string GetRandomString(string characterSet, int length)
        {
            StringBuilder stringBuilder = new StringBuilder();
            for (int i = 0; i < length; i++)
            {
                stringBuilder.Append(GetRandomChar(characterSet));
            }
            return stringBuilder.ToString();
        }

    }
}
