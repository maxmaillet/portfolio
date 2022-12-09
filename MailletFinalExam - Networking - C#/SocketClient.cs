using System;
using System.Net;
using System.Net.Sockets;
using System.Text;


public class Maillet_SocketClient
{
    public static string eof = "<EOF>";

    public static void StartClient()
    {
        // Data buffer for incoming data.  
        byte[] bytes = new byte[1024];
        string input = "";

        // Connect to a remote device.  
        try
        {
            // Establish the remote endpoint for the socket.  
            // This example uses port 11000 on the local computer.  
            IPHostEntry ipHostInfo = Dns.GetHostEntry(Dns.GetHostName());
            IPAddress ipAddress = ipHostInfo.AddressList[0];
            IPEndPoint remoteEP = new IPEndPoint(ipAddress, 11000);

            // Create a TCP/IP  socket.  
            Socket sender = new Socket(ipAddress.AddressFamily,
                SocketType.Stream, ProtocolType.Tcp);

            // Connect the socket to the remote endpoint. Catch any errors.  
            try
            {
                sender.Connect(remoteEP);

                Console.WriteLine("Socket connected to {0}",
                sender.RemoteEndPoint.ToString());
                Console.WriteLine("Type \"exit\" to quit.");
                Console.WriteLine("[H.A.L. 9000]: Hello.");
                Console.Write("[You]: ");

                while (true)
                {
                    input = Console.ReadLine();
                    input = input.Replace("[You]: ", string.Empty);

                    if (input.ToLower() == "exit")
                    {
                        byte[] msg = Encoding.ASCII.GetBytes("End of Stream" + eof);
                        int bytesSent = sender.Send(msg);
                        break;
                    }
                    else if (input == "")
                    {
                        Console.Write("[You]: ");
                    }
                    else
                    {
                        byte[] msg = Encoding.ASCII.GetBytes(input + eof);
                        int bytesSent = sender.Send(msg);
                        int bytesRec = sender.Receive(bytes);
                        Console.WriteLine("[H.A.L. 9000]: {0}",
                        Encoding.ASCII.GetString(bytes, 0, bytesRec));
                        Console.Write("[You]: ");
                    }
                }

                // Release the socket.  
                sender.Shutdown(SocketShutdown.Both);
                sender.Close();

            }
            catch (ArgumentNullException ane)
            {
                Console.WriteLine("ArgumentNullException : {0}", ane.ToString());
            }
            catch (SocketException se)
            {
                Console.WriteLine("SocketException : {0}", se.ToString());
            }
            catch (Exception e)
            {
                Console.WriteLine("Unexpected exception : {0}", e.ToString());
            }

        }
        catch (Exception e)
        {
            Console.WriteLine(e.ToString());
        }
    }

    public static int Main(String[] args)
    {
        StartClient();
        return 0;
    }
}
