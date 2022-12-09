using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;

public class Maillet_SocketListener
{
    // Incoming data from the client.  
    public static string data = null;
    public static string eof = "<EOF>";
    public static string original = null;

    public static void StartListening()
    {
        // Data buffer for incoming data.  
        byte[] bytes = new Byte[1024];

        // Establish the local endpoint for the socket.  
        // Dns.GetHostName returns the name of the
        // host running the application.  
        IPHostEntry ipHostInfo = Dns.GetHostEntry(Dns.GetHostName());
        IPAddress ipAddress = ipHostInfo.AddressList[0];
        IPEndPoint localEndPoint = new IPEndPoint(ipAddress, 11000);

        // Create a TCP/IP socket.  
        Socket listener = new Socket(ipAddress.AddressFamily,
            SocketType.Stream, ProtocolType.Tcp);

        // Bind the socket to the local endpoint and
        // listen for incoming connections.  
        try
        {
            listener.Bind(localEndPoint);
            listener.Listen(10);
            bool valid = true;
            // Start listening for connections.  
            while (valid)
            {
                Console.WriteLine("Waiting for a connection...");
                // Program is suspended while waiting for an incoming connection.  
                Socket handler = listener.Accept();
                while (true)
                {
                    data = null;

                    // An incoming connection needs to be processed.  
                    while (true)
                    {
                        int bytesRec = handler.Receive(bytes);
                        data += Encoding.ASCII.GetString(bytes, 0, bytesRec);
                        if (data.IndexOf(eof) > -1)
                        {
                            break;
                        }
                    }

                    // Show the data on the console.  
                    Console.WriteLine("Text received : {0}", data);
                    original = data.Replace(eof, string.Empty);

                    if (data == "End of Stream" + eof)
                    {
                        valid = false;
                        break;
                    }
                    else
                    {
                        data = data.Substring(0, data.Length - 5);
                        int res;
                        string num = Regex.Replace(data, @"\D+", string.Empty);
                        bool isInt = int.TryParse(num, out res);
                        if (isInt) data = $"{res} * {res} = {Math.Pow(res, 2)}";
                        else
                        {
                            string pattern = @"(blue)|(red)|(green)|(yellow)|(orange)|(white)";
                            Regex food = new Regex(pattern);

                            if (food.IsMatch(data.ToLower()))
                            {
                                string color = food.Match(data.ToLower()).Value;
                                Random rand = new Random();
                                string[] options;
                                int option;

                                switch (color)
                                {
                                    case "blue":
                                        options = new string[] { "blueberries", "blue crayons", "blueberry poptarts" };
                                        option = rand.Next(options.Length);
                                        data = options[option];
                                        break;
                                    case "red":
                                        options = new string[] { "apples", "a nice steak", "red peppers", "Whole Lotta Red - Playboi Carti (180g 2LP Limited Edition Red Splatter Vinyl)" };
                                        option = rand.Next(options.Length);
                                        data = options[option];
                                        break;
                                    case "green":
                                        options = new string[] { "apples", "green peppers", "broccoli" };
                                        option = rand.Next(options.Length);
                                        data = options[option];
                                        break;
                                    case "yellow":
                                        options = new string[] { "apples", "yellow peppers", "hawaiian pizza", "licking the wrapper of a coffee crisp bar" };
                                        option = rand.Next(options.Length);
                                        data = options[option];
                                        break;
                                    case "orange":
                                        options = new string[] { "oranges", "orange peppers", "pumpkin pie" };
                                        option = rand.Next(options.Length);
                                        data = options[option];
                                        break;
                                    case "white":
                                        options = new string[] { "cheestrings", "a ham sandwich on wonderbread" };
                                        option = rand.Next(options.Length);
                                        data = options[option];
                                        break;
                                    default:
                                        break;
                                }

                                data = $"My favorite {color} food is {data}.";
                            }
                            else
                            {
                                if (data.ToLower().IndexOf("fizz") > -1)
                                {
                                    data = data.ToLower().Replace("fizz", "buzz");
                                    data = data.Substring(0, 1).ToUpper() + data.Substring(1);
                                }
                                if (data.ToLower().IndexOf("silver") > -1)
                                {
                                    data = $"Gold{data.Substring(data.ToLower().IndexOf("silver") + 6)}";
                                }
                                if (data[data.Length - 1] != '.') data = data + ".";
                                if (data.ToLower().IndexOf("hard coded") > -1)
                                {
                                    data = data.ToLower().Replace("hard coded", "$%&@ *%^&!");
                                    data = $"{data.Substring(0, 1).ToUpper()}{data.Substring(1)} - Hard coding is bad development.";
                                }
                            }
                        }
                    }
                    data = data == original ? "I'm afraid I can't do that." : data;
                    // Echo the data back to the client.  
                    byte[] msg = Encoding.ASCII.GetBytes(data);
                    handler.Send(msg);
                }

                handler.Shutdown(SocketShutdown.Both);
                handler.Close();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e.ToString());
        }

        Console.WriteLine("\nPress ENTER to continue...");
        Console.Read();
    }

    public static int Main(String[] args)
    {
        StartListening();
        return 0;
    }
}
